import { FastifyRequest, onRequestHookHandler } from 'fastify'
import { default_401_error_response } from '../business.logic/errors'
import Config from '../config'
import { dbug } from '../utility/logging'
import { TContextualUser } from '../schema/user'
import { read_user_by_name } from '../model/user'
import { USER_CACHE } from '../business.logic/cache'
import { is_object } from '../utility'
import JsonapiRequestDriver from '../business.logic/JsonapiRequestDriver'

declare module 'fastify' {
  interface FastifyRequest {
    token?: string
    usr?: TContextualUser
    cookie?: string
    isFromBrowser?: boolean
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
    }, req.isFromBrowser))
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
    await authorize_request(req)

    // TODO: Write more session-related logic here

  } catch (e) {
    // Allow access if app is in development mode.
    if (!Config.DEV) {
      dbug('JWT verification failed.', e)
      reply.code(401).send(default_401_error_response({
        title: 'JWT verification failed.',
        detail: (e as Error).stack,
        source: {
          pointer: '/src/middleware/on.request.ts',
          parameter: req.url
        }
      }, req.isFromBrowser))
    }
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
    await authorize_request(req)
  } catch {}
}

/**
 * Authorizes the incoming request by verifying the JWT token.
 * 
 * This function extracts and verifies the JWT from the request, decodes the payload,
 * and sets the user information and token on the request object for further use.
 * 
 * @param req - The Fastify request object containing the JWT in the authorization header or cookies.
 * @throws Will throw an error if JWT verification fails.
 */
export const authorize_request = async (req: FastifyRequest): Promise<void> => {
  await contextualize_request(req)
  
  // The @fastify/jwt plugin with cookie configuration should automatically check both
  // Authorization header and cookies when jwtVerify() is called
  const payload = await req.jwtVerify()
  if (payload) {
    req.usr = payload as TContextualUser
    dbug('Decoded value from token:', req.usr)

    // Enforce JWT version matching against current user document
    if (req.usr?.name) {
      // Try cache first
      const cached = USER_CACHE.get(req.usr.name) as { jwt_version?: number } | undefined
      let currentVersion = cached?.jwt_version
      if (typeof currentVersion !== 'number') {
        const user = await read_user_by_name(req.usr.name)
        currentVersion = user?.jwt_version
        if (user) {
          USER_CACHE.set(user.name, user)
        }
      }
      const tokenVersion = req.usr.jwt_version ?? 0
      if (typeof currentVersion === 'number' && tokenVersion !== currentVersion) {
        throw new Error('Outdated token. Please sign in again.')
      }
    }
  } else {
    dbug('Token is missing.')
  }
}

/**
 * Contextualizes the request by extracting and setting authentication-related data.
 * 
 * This function:
 * 1. Extracts JWT token from Authorization header
 * 2. Extracts cookies from either headers or request body (JSON API format)
 * 3. Sets the extracted data on the request object for downstream use
 * 
 * @param req - The Fastify request object to contextualize
 */
export const contextualize_request = async (req: FastifyRequest): Promise<void> => {
  req.isFromBrowser = is_browser_request(req)
  // Extract JWT token from Authorization header
  req.token = req.headers.authorization?.replace('Bearer ', '')
  if (req.token) {
    dbug('JWT token extracted from Authorization header')
  }

  // Extract cookie from headers (standard approach)
  if (req.headers.cookie) {
    req.cookie = req.headers.cookie
    dbug('Cookie extracted from request headers')
  }
  // Fallback: Extract cookie from JSON API request body
  else if (is_object(req.body) && Object.keys(req.body).length > 0) {
    try {
      const driver = new JsonapiRequestDriver<{ cookie?: string }>(req.body)
      const cookie = driver.getAttribute('cookie')
      if (cookie) {
        req.cookie = cookie
        dbug('Cookie extracted from request body via JSON API driver')
      } else {
        dbug('No cookie found in request body attributes')
      }
    } catch (error) {
      dbug('Error extracting cookie from request body:', error)
    }
  } else {
    dbug('No cookie received from headers or request body')
  }
}

/**
 * Check if the request came from a browser. Returns `true` if it is.
 *
 * @param req 
 * @returns 
 */
const is_browser_request = (req: FastifyRequest): boolean => {
  const userAgent = req.headers['user-agent'] || ''
  
  // Common browser indicators
  const browserPatterns = [
    /mozilla/i,
    /chrome/i,
    /safari/i,
    /firefox/i,
    /edge/i,
    /opera/i,
    /msie/i,
    /trident/i // IE11
  ];
  
  // Check if any browser pattern matches
  const hasBrowserUA = browserPatterns.some(pattern => pattern.test(userAgent))
  
  // Additional check: browsers typically send 'Accept' header with 'text/html'
  const accept = req.headers['accept'] || ''
  const acceptsHtml = accept.includes('text/html')
  
  return hasBrowserUA && acceptsHtml
}