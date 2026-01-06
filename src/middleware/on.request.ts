import { onRequestHookHandler } from 'fastify'
import Config from '../config'
import { dbug } from '../utility/logging'
import { TContextualUser } from '../schema/user'
import { TThemeMode } from '@tuber/shared'
import OnRequestAuthorization from '../business.logic/OnRequestAuthorization'
import JsonapiErrorBuilder from '../business.logic/builder/JsonapiErrorBuilder'
import { signInDialogState } from '../state/dialog'

declare module 'fastify' {
  interface FastifyRequest {
    token?: string
    usr?: TContextualUser
    cookie?: string
    isFromBrowser?: boolean
    themeMode?: TThemeMode
  }
}

/**
 * Supplies authentication check for all routes.
 *
 * @param req 
 * @param reply 
 * @param done 
 */
const on_request_default: onRequestHookHandler = async (
  req,
  reply
): Promise<void> => {
  try {
    const auth = new OnRequestAuthorization(req)
    const result = await auth.authorizeRequest()
    if (!result.authorized) {
      reply.code(401).send(new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle('Authorization failed.')
        .withDetail(result.reason)
        .withSource({
          pointer: '/src/middleware/on.request.ts',
          parameter: req.url
        }).build())
    }
  } catch (e) {
    dbug('JWT verification failed.', e)
    const builder = new JsonapiErrorBuilder()
      .withStatus(401)
      .withCode('AUTHENTICATION_REQUIRED')
      .withTitle('JWT verification failed.')
      .withDetail((e as Error).stack)
      .withSource({
        pointer: '/src/middleware/on.request.ts',
        parameter: req.url
      })
    if (req.token && req.isFromBrowser) {
      builder.withState({ 'dialog': signInDialogState })
    }
    reply.code(401).send(builder.build())
  }
}

export default on_request_default

/**
 * [TODO] Test this logic to make sure it does not cause a 401 http error code.
 * @param req
 * @param reply
 * @param done
 */
export const on_request_dev: onRequestHookHandler = async (
  req,
  reply
): Promise<void> => {
  try {
    if (Config.DEV) {
      const auth = new OnRequestAuthorization(req)
      const result = await auth.authorizeRequest()
      if (!result.authorized) {
        reply.code(401).send(new JsonapiErrorBuilder()
          .withStatus(401)
          .withCode('AUTHENTICATION_REQUIRED')
          .withTitle('Authorization failed.')
          .withDetail(result.reason)
          .withSource({
            pointer: '/src/middleware/on.request.ts',
            parameter: req.url
          }).build())
      }
    } else {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('This endpoint does not exist')
        .build())
    }
  } catch (e) {
    dbug('JWT verification failed.', e)
    const builder = new JsonapiErrorBuilder()
      .withStatus(401)
      .withCode('AUTHENTICATION_REQUIRED')
      .withTitle('JWT verification failed.')
    if (req.token && req.isFromBrowser) {
      builder.withState({ 'dialog': signInDialogState })
    }
    reply.code(401).send(builder.build())
  }
}

/**
 * Optional authentication hook for routes that don't require mandatory authentication.
 *
 * @param req - The Fastify request object.
 * @param reply - The Fastify reply object (unused in this implementation).
 * @param done - Callback function to signal completion of the hook.
 */
export const on_request_optional: onRequestHookHandler = async (req): Promise<void> => {
  try {
    const auth = new OnRequestAuthorization(req)
    await auth.authorizeRequest()
  } catch {}
}