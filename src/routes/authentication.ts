import { FastifyRequest, FastifyReply, FastifyPluginAsync, RouteOptions } from 'fastify'
import { check_password } from '../business.logic/security'
import { alertResponse as alert } from '../state/dialog'
import { IRequestAuth } from '../common.types'
import {
  error_id,
  shielded_401_error_response
} from '../business.logic/errors'
import {
  TJsonapiStateResponse,
  MSG_500_ERROR_MESSAGE,
  THEME_MODE,
  TThemeMode,
  THEME_DEFAULT_MODE
} from '@tuber/shared'
import get_bootstrap_authenticated_state from '../state/bootstrap'
import { get_contextual_user, read_user } from '../model/session'
import { option } from '../business.logic'
import { USER_CACHE } from '../business.logic/cache'
import { log_safe, log_err_safe, task, errr, dbug } from '../utility/logging'
import JsonapiRequestDriver from '../business.logic/JsonapiRequestDriver'
import RequestDataValidator from '../business.logic/RequestDataValidator'
import signInFormState from '../state/form/sign.in.form.state'
import { blacklist_token } from '../model/blacklisted.token'
import JsonapiErrorBuilder from '../business.logic/builder/JsonapiErrorBuilder'
import { UserModel } from '../model/user'
import { is_record, to_error_object } from '../utility'
import OnRequestAuthorization from '../business.logic/OnRequestAuthorization'
import Config from '../config'

// Lightweight rate limiter for signin (fallback if plugin not used)
const signinAttempts: Map<string, { count: number; resetAt: number }> = new Map()
const SIGNIN_WINDOW_MS = 60 * 1000
const SIGNIN_MAX_ATTEMPTS = 20

const authentication: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {
  const skipRateLimit = process.env.SKIP_RATE_LIMIT === 'true'
  const opts = { ...rootOpts }

  fastify.post('/signin', opts, async function  (
    req: FastifyRequest<IRequestAuth>,
    reply: FastifyReply,
  ) {
    // Basic per-IP rate limiting (production and development)
    // Bypass during tests when TEST env is set
    task('Enforcing rate limiting ')
    if (!skipRateLimit) {
      const ip = (req.ip || req.headers['x-forwarded-for'] as string || 'unknown').toString()
      const now = Date.now()
      const entry = signinAttempts.get(ip)
      if (!entry || now > entry.resetAt) {
        signinAttempts.set(ip, { count: 1, resetAt: now + SIGNIN_WINDOW_MS })
      } else {
        entry.count += 1
        if (entry.count > SIGNIN_MAX_ATTEMPTS) {
          task.end('[❌]')
          dbug('[429] Rate limit exceeded for IP:', ip)
          reply.code(429).send(new JsonapiErrorBuilder()
            .withStatus(429)
            .withCode('RATE_LIMITED')
            .withTitle('Too Many Requests')
            .withDetail('Please wait a minute before trying again.')
            .build())
          return
        }
      }
      task.end('[✔️]')
    } else {
      task.end('[⚠️]') // Skip rate limiting
      dbug('Rate limiting is disabled')
    }
    task('Checking credentials ')
    const driver = new JsonapiRequestDriver(req.body)
    const credentials = driver.getAttribute('credentials')
    if (!is_record(credentials) || !credentials.username || !credentials.password) {
      task.end('[❌]')
      dbug('[400] Invalid or missing credentials')
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MALFORMED_REQUEST')
        .withTitle('Credentials Required')
        .withDetail('No credentials were provided in the request')
        .build())
      return
    }
    task.end('[✔️]')
    const { username, password, options: o } = credentials
    const validator = new RequestDataValidator(credentials, signInFormState)
    log_safe('Authenticating user credentials', req.body)
    task('Validating signin request data ')
    const errorResponse = validator.validateAgainstFormState()
    if (errorResponse) {
      task.end('[❌]')
      dbug('[400] Validation errors in signin request', errorResponse)
      reply.code(400).send(errorResponse)
      return
    }
    task.end('[✔️]')
    const title = 'Wrong username or password!'
    task('Looking up user in the database ')
    try {
      const user = await read_user({ name: username, includePassword: true }) // include password for verification
      if (!user) {
        task.end('[❌]')
        dbug('[401] No user found with username:', username)
        reply.code(401).send({
          ...alert(title),
          ...new JsonapiErrorBuilder()
            .withStatus(401)
            .withCode('AUTHENTICATION_REQUIRED')
            .withTitle(title)
            .build()
        })
        return
      }
      task.end('[✔️]')
      dbug('User found for authentication:', username)
      task('Verifying password ')
      if (!user.password) {
        task.end('[❌]')
        dbug('[401] Missing password for user:', username)
        reply.code(401).send({
          ...alert(title),
          ...new JsonapiErrorBuilder()
            .withStatus(401)
            .withCode('AUTHENTICATION_REQUIRED')
            .withTitle(title)
            .build()
        })
        return
      }
      const passwordIsCorrect = await check_password(password, user.password)
      if (!passwordIsCorrect) {
        task.end('[❌]')
        dbug('[401] Incorrect password for user:', username)
        reply.code(401).send({
          ...alert(title),
          ...new JsonapiErrorBuilder()
            .withStatus(401)
            .withCode('AUTHENTICATION_REQUIRED')
            .withTitle(title)
            .build()
        })
        return
      }
      task.end('[✔️]')

      // Update last_signin_at timestamp
      task('Updating last_signin_at timestamp ')
      user.last_signin_at = new Date()
      await user.save()
      task.end('[✔️]')

      // Generate JWT token
      task('Generating authentication token ')
      USER_CACHE.set(user.name, user)
      const usr = get_contextual_user(user)
      const expiresIn = option<string>(o)('keep-signed-in', '60d', '1d')
      const token = await reply.jwtSign(usr, { expiresIn })
      task.end('[✔️]')
      dbug('Expires in', expiresIn === '60d'
        ? '2 months.'
        : '24 hours.')
      const theme = req.themeMode
        ?? driver.getAttribute('theme_mode')
        ?? Config.read<TThemeMode>(THEME_MODE, THEME_DEFAULT_MODE)
 
      // Set HTTP-only cookie for token
      task('Setting authentication cookie ')
      reply.setCookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: expiresIn === '60d' ? 60 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
        path: '/'
      })
      task.end('[✔️]')
      reply
        .code(200)
        .send({
          'state': await get_bootstrap_authenticated_state({
            usr,
            theme
          })
        } as TJsonapiStateResponse)
      return
    } catch (e) {
      task.end(MSG_500_ERROR_MESSAGE.replace('[500]', '[5005]'))
      const error = to_error_object(e)
      log_err_safe('[5005] Error attempting to authenticate user', {
        error,
        username
      })
      reply.code(500).send({
        ...error_id(5005).default_500_error_response(e),
        ...alert(error.message),
      })
      return
    }
  }) // End /signin

  const signoutOpts: Partial<RouteOptions> = {
    ...opts,
    onRequest: async (req, reply): Promise<void> => {
      try {
        await (new OnRequestAuthorization(req))
          .disableBlacklist()
          .authorizeRequest()
      } catch {
        reply.code(401).send(shielded_401_error_response())
        return
      }
    }
  }

  fastify.post('/signout', signoutOpts, async function (
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    task('Checking user data for signout ')
    try {
      if (!req.usr || !req.usr.name) {
        task.end('[❌]')
        task.log('[401] No authenticated user data found in request')
        reply.code(401).send(shielded_401_error_response())
        return
      }
      log_safe('[✔️]', req.usr)
      const { name } = req.usr
      task('Blacklisting authentication token ')
      if (req.token && process.env.ENABLE_TOKEN_BLACKLIST === 'true') {
        // Decode the token payload to get expiration time
        try {
          const payload = req.token.split('.')[1]
          const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString())
          const expiresAt = decodedPayload?.exp ? new Date(decodedPayload.exp * 1000) : new Date(Date.now() + 24 * 60 * 60 * 1000) // fallback to 24 hours
          
          // Blacklist the token
          const blacklistDoc = await blacklist_token(req.token, expiresAt, 'user_signout')
          if (blacklistDoc) {
            task.end('[✔️]')
            dbug('Token blacklisted for user:', name)
          } else {
            task.end('[❌]')
            errr('[500] Failed to blacklist token for user:', name)
          }
        } catch (decodeError) {
          // If decoding fails, use fallback expiration
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
          const blacklistDoc = await blacklist_token(req.token, expiresAt, 'user_signout')
          if (blacklistDoc) {
            task.end('[✔️]')
            dbug('Token blacklisted with fallback expiration for user:', name)
          } else {
            task.end('[❌]')
            errr('[500] Failed to blacklist token for user:', name)
          }
        }
      } else {
        task.end('[⚠️]')
        dbug('Blacklisting skipped or token missing for user:', name)
      }

      // Remove user from cache
      USER_CACHE.del(name)

      // Clear the token cookie
      reply.clearCookie('token', { path: '/' })

      // Increment jwt_version on signout to invalidate outstanding tokens
      task('Incrementing jwt_version on signout ')
      try {
        const userDoc = await UserModel.findOne({ name })
        if (userDoc) {
          userDoc.jwt_version = (userDoc.jwt_version ?? 0) + 1
          await userDoc.save()
          task.end('[✔️]')
          dbug('Incremented jwt_version for user:', name, '->', userDoc.jwt_version)
          // Update cache so subsequent requests see the bump
          USER_CACHE.set(name, userDoc)
        }
      } catch (verErr) {
        task.end('[❌]')
        errr('[500] Failed to increment jwt_version on signout:', verErr)
      }
      task('Signing out authenticated user ')
      reply.code(204).send()
      task.end('[✔️]')
      return
    } catch (e) {
      task.end(MSG_500_ERROR_MESSAGE.replace('[500]', '[5007]'))
      log_err_safe('[5007] Error attempting signout user', {
        error: e,
        user: req.user
      })
      reply.code(500).send(error_id(5007).default_500_error_response(e))
      return
    }
  })
}

export default authentication