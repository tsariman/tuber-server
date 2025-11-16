import { FastifyRequest, onRequestHookHandler } from 'fastify'
import { default_401_error_response } from '../business.logic/errors'
import Config from '../config'
import { dbug } from '../utility/logging'
import { TCipheredUser } from '../schema/users'

declare module 'fastify' {
  interface FastifyRequest {
    token?: string
    usr?: TCipheredUser
    cookie?: string
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
  reply,
  done
): Promise<void> => {
  void done
  try {
    await authorize_request(req)

    // TODO: Write more session-related logic here

  } catch (e) {
    dbug('JWT verification failed.', e)
    reply.code(401).send(default_401_error_response({
      title: 'JWT verification failed.',
      detail: (e as Error).stack,
      source: {
        pointer: '/src/middleware/on.request.ts',
        parameter: req.url
      }
    }))
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
  reply,
  done
): Promise<void> => {
  try {
    await authorize_request(req)

    // TODO: Write more session-related logic here

  } catch (e) {
    // Allow access if app is in development mode.
    if (Config.DEV) {
      done()
    } else {
      dbug('JWT verification failed.', e)
      reply.code(401).send(default_401_error_response({
        title: 'JWT verification failed.',
        detail: (e as Error).stack,
        source: {
          pointer: '/src/middleware/on.request.ts',
          parameter: req.url
        }
      }))
    }
  }
}

/**
 * Optional authentication hook for routes that don't require mandatory authentication.
 * Attempts to authorize the request using JWT verification, but allows the request to proceed
 * even if authentication fails, by calling the done callback without error.
 *
 * @param req - The Fastify request object.
 * @param reply - The Fastify reply object (unused in this implementation).
 * @param done - Callback function to signal completion of the hook.
 */
export const on_request_optional: onRequestHookHandler = async (
  req,
  reply,
  done
): Promise<void> => {
  void reply
  try {
    await authorize_request(req)
  } catch (e) {
    done()
  }
}

/**
 * Authorizes the incoming request by verifying the JWT token.
 * 
 * This function extracts and verifies the JWT from the request, decodes the payload,
 * and sets the user information and token on the request object for further use.
 * 
 * @param req - The Fastify request object containing the JWT in the authorization header.
 * @throws Will throw an error if JWT verification fails.
 */
export const authorize_request = async (req: FastifyRequest): Promise<void> => {
  const payload = await req.jwtVerify()
  if (payload) {
    req.usr = payload as TCipheredUser
    dbug('Decoded value from token:', req.usr)
  } else {
    dbug('Token is missing.')
  }
  req.token = req.headers.authorization?.replace('Bearer ', '')
  req.cookie = req.headers.cookie
  if (req.headers.cookie) {
  } else {
    dbug('No cookie received.')
  }
}