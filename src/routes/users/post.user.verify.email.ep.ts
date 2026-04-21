import { FastifyReply } from 'fastify'
import { TUsersFastifyRequest } from '../../schema/user'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { UserModel, transform_user_doc } from '../../model/user'
import { USER_CACHE } from '../../business.logic/cache'
import Config from '../../config'
import { to_error_object } from '../../utility'
import { EP_AUTH } from '@tuber/shared'

const normalize_origin = (origin?: string): string | undefined => {
  if (!origin || typeof origin !== 'string') {
    return undefined
  }

  try {
    const url = new URL(origin)
    return `${url.protocol}//${url.host}`
  } catch {
    return undefined
  }
}

const is_browser_navigation = (req: TUsersFastifyRequest): boolean => {
  const accept = String(req.headers.accept ?? '').toLowerCase()
  return req.method === 'GET' && accept.includes('text/html')
}

const to_client_redirect_url = (status: string, message: string): string => {
  const fallback = normalize_origin(Config.CLIENT_DOMAIN)
    || normalize_origin(Config.APP_BASE_URL)
    || 'http://localhost:5173'

  const redirectUrl = new URL(fallback)
  redirectUrl.searchParams.set('email_verification', status)
  redirectUrl.searchParams.set('message', message)
  redirectUrl.searchParams.set('return_route', `/${EP_AUTH.CLIENT_IN}`)
  return redirectUrl.toString()
}

/** `POST|GET /users/email/verify` endpoint handler */
export default async function post_user_verify_email_endpoint (
  req: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    const body = (req.body as any) ?? {}
    const query = (req.query as Record<string, string | undefined>) ?? {}
    const code: string | undefined = body?.data?.attributes?.code ?? body?.code ?? query.code
    const email: string | undefined = body?.data?.attributes?.email ?? body?.email ?? query.email

    if (!code || !email) {
      if (is_browser_navigation(req)) {
        reply.redirect(to_client_redirect_url('error:missing_fields', 'Missing code or email'))
        return
      }

      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withTitle('Bad Request')
        .withDetail('Missing code or email')
        .build())
      return
    }

    const user = await UserModel.findOne({ email })
    if (!user || !user.email_verification_code) {
      if (is_browser_navigation(req)) {
        reply.redirect(to_client_redirect_url('error:not_found', 'User or verification request not found'))
        return
      }

      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withTitle('Not Found')
        .withDetail('User or verification request not found')
        .build())
      return
    }

    if (user.email_verification_code !== code) {
      if (is_browser_navigation(req)) {
        reply.redirect(to_client_redirect_url('error:invalid_code', 'Invalid verification code'))
        return
      }

      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withTitle('Bad Request')
        .withDetail('Invalid verification code')
        .build())
      return
    }

    if (user.email_verification_code_expires && user.email_verification_code_expires.getTime() < Date.now()) {
      if (is_browser_navigation(req)) {
        reply.redirect(to_client_redirect_url('error:expired', 'Verification code expired'))
        return
      }

      reply.code(410).send(new JsonapiErrorBuilder()
        .withStatus(410)
        .withTitle('Gone')
        .withDetail('Verification code expired')
        .build())
      return
    }

    user.email_verified = true
    user.email_verified_at = new Date()
    user.email_verification_code = undefined
    user.email_verification_code_expires = undefined
    await user.save()
    USER_CACHE.del(user.name)

    if (is_browser_navigation(req)) {
      reply.redirect(to_client_redirect_url('success', 'Email successfully verified'))
      return
    }

    reply.code(200).send(
      JsonapiResponseBuilder.forSingleResource(transform_user_doc(user), 'users')
        .withState({
          app: { route: 'default-success' },
          tmp: { 'default-success': { 'message': 'Email successfully verified' }}
        })
        .build()
    )
  } catch (e) {
    const error = to_error_object(e)
    reply.code(500).send(new JsonapiErrorBuilder()
      .withStatus(500)
      .withTitle('Server Error')
      .withDetail(error.message)
      .build())
  }
}
