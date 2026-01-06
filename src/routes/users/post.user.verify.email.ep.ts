import { FastifyReply } from 'fastify'
import { TUsersFastifyRequest } from '../../schema/user'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { UserModel, transform_user_doc } from '../../model/user'
import { to_error_object } from '../../utility'

/** `POST /users/email/verify` endpoint handler */
export default async function post_user_verify_email_endpoint (
  req: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    const body = (req.body as any) ?? {}
    const code: string | undefined = body?.data?.attributes?.code ?? body?.code
    const email: string | undefined = body?.data?.attributes?.email ?? body?.email

    if (!code || !email) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withTitle('Bad Request')
        .withDetail('Missing code or email')
        .build())
      return
    }

    const user = await UserModel.findOne({ email })
    if (!user || !user.email_verification_code) {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withTitle('Not Found')
        .withDetail('User or verification request not found')
        .build())
      return
    }

    if (user.email_verification_code !== code) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withTitle('Bad Request')
        .withDetail('Invalid verification code')
        .build())
      return
    }

    if (user.email_verification_code_expires && user.email_verification_code_expires.getTime() < Date.now()) {
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
