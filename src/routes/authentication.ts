import { FastifyRequest, FastifyReply, FastifyPluginAsync, RouteOptions } from 'fastify'
import { check_password } from '../business.logic/security'
import { defaultDialogAlertState as alert } from '../state/dialog'
import { IRequestAuth } from '../common.types'
import {
  default_500_error_response,
  shielded_401_error_response
} from '../business.logic/errors'
import { TJsonapiStateResponse, MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import get_bootstrap_authenticated_state from '../state/bootstrap'
import { get_contextual_user, read_user } from '../model/session'
import {  get_theme_mode, option } from '../business.logic'
import { USER_CACHE } from '../business.logic/cache'
import { log_safe, log_err_safe, task, task_end, dbug } from '../utility/logging'
import JsonapiRequestDriver from '../business.logic/JsonapiRequestDriver'
import { assure } from '../utility'
import RequestDataValidator from '../business.logic/RequestDataValidator'
import signInFormState from '../state/form/sign.in.form.state'
import { blacklist_token } from '../model/blacklisted.token'
import { authorize_request } from '../middleware/on.request'
import JsonapiErrorBuilder from '../business.logic/builder/JsonapiErrorBuilder'
import { UserModel } from '../model/user'

// Lightweight rate limiter for signin (fallback if plugin not used)
const signinAttempts: Map<string, { count: number; resetAt: number }> = new Map()
const SIGNIN_WINDOW_MS = 60 * 1000
const SIGNIN_MAX_ATTEMPTS = 20

const authentication: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const IS_TEST = process.env.TEST === 'true'

  const opts = { ...rootOpts }

  fastify.post('/signin', opts, async function  (
    req: FastifyRequest<IRequestAuth>,
    reply: FastifyReply,
  ) {
    task('Authenticating user... ')
    // Basic per-IP rate limiting (production and development)
    // Bypass during tests when TEST env is set
    const skipRateLimit = IS_TEST === true
    if (!skipRateLimit) {
      const ip = (req.ip || req.headers['x-forwarded-for'] as string || 'unknown').toString()
      const now = Date.now()
      const entry = signinAttempts.get(ip)
      if (!entry || now > entry.resetAt) {
        signinAttempts.set(ip, { count: 1, resetAt: now + SIGNIN_WINDOW_MS })
      } else {
        entry.count += 1
        if (entry.count > SIGNIN_MAX_ATTEMPTS) {
          task_end('Faild. ❌ ')
          dbug('Rate limit exceeded for signin from IP:', ip)
          reply.code(429).send(new JsonapiErrorBuilder()
            .withStatus(429)
            .withCode('RATE_LIMITED')
            .withTitle('Too Many Requests')
            .withDetail('Please wait a minute before trying again.')
            .build())
          return
        }
      }
    }
    const driver = new JsonapiRequestDriver(req.body)
    const credentials = assure(driver.getAttribute('credentials'))
    const { username, password, options: o } = credentials
    const validator = new RequestDataValidator(credentials, signInFormState)
    log_safe('Authenticating user request:', req.body)
    
    const errorResponse = validator.validateAgainstFormState()
    if (errorResponse) {
      task_end('Faild. ❌ ')
      dbug('Validation errors found in signin request.')
      reply.code(400).send(errorResponse)
      return
    }
    if (username) {
      try {
        const user = await read_user({ name: username }) // uses cache internally
        if (user) {
          if (password && user.password) {
            const passwordIsCorrect = await check_password(password, user.password)
            if (passwordIsCorrect) {

              // Update last_signin_at timestamp
              user.last_signin_at = new Date()
              await user.save()

              task_end('Ok. ✔️ ')
              dbug('Updated last_signin_at for user:', username)
              USER_CACHE.set(user.name, user)
              const usr = get_contextual_user(user)
              const expiresIn = option<string>(o)('keep-signed-in', '60d', '1d')
              const token = await reply.jwtSign(usr, { expiresIn })
              
              dbug('User authenticated:', username)
              dbug('Session expires in', expiresIn === '60d'
                ? '2 months.'
                : '24 hours.'
              )
              const theme = get_theme_mode(req.cookie) // get_theme_mode(req.body.cookie)
              
              // Set HTTP-only cookie for token
              reply.setCookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: expiresIn === '60d' ? 60 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000,
                path: '/'
              })

              reply
                .code(200)
                .send({
                  'state': await get_bootstrap_authenticated_state({
                    usr,
                    token,
                    theme
                  })
                } as TJsonapiStateResponse)
              return
            }
          }
        }
      } catch (e) {
        task_end(MSG_500_ERROR_MESSAGE)
        log_err_safe('Error attempting to authenticate user', { error: e, username })
        reply.code(500).send({
          ...default_500_error_response(e),
          ...alert((e as Error).message),
        })
        return
      }
    }
    const title = 'Wrong username or password!'
    task_end(`Faild. ❌ `)
    dbug('Authentication failed for user:', username)
    reply.code(401).send({
      ...alert(title),
      ...new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle(title)
        .build()
    })
  })

  const signoutOpts: Partial<RouteOptions> = {
    ...opts,
    onRequest: async (req, reply): Promise<void> => {
      try {
        await authorize_request(req)
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
    try {
      if (!req.usr) {
        reply.code(401).send(shielded_401_error_response())
        return
      }
      const { name } = req.usr
      if (req.token && process.env.ENABLE_TOKEN_BLACKLIST === 'true') {
        // Decode the token payload to get expiration time
        try {
          const payload = req.token.split('.')[1]
          const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString())
          const expiresAt = decodedPayload?.exp ? new Date(decodedPayload.exp * 1000) : new Date(Date.now() + 24 * 60 * 60 * 1000) // fallback to 24 hours
          
          // Blacklist the token
          await blacklist_token(req.token, expiresAt, 'user_signout')
          dbug('Token blacklisted for user:', name)
        } catch (decodeError) {
          // If decoding fails, use fallback expiration
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
          await blacklist_token(req.token, expiresAt, 'user_signout')
          dbug('Token blacklisted with fallback expiration for user:', name)
        }
      }

      // Remove user from cache
      USER_CACHE.del(name)
      task_end('Ok. ✔️ ')
      dbug('User removed from cache:', name)
      
      // Clear the token cookie
      reply.clearCookie('token', { path: '/' })

      // Increment jwt_version on signout to invalidate outstanding tokens
      try {
        const userDoc = await UserModel.findOne({ name })
        if (userDoc) {
          userDoc.jwt_version = (userDoc.jwt_version ?? 0) + 1
          await userDoc.save()
          dbug('Incremented jwt_version for user:', name, '->', userDoc.jwt_version)
          // Update cache so subsequent requests see the bump
          USER_CACHE.set(name, userDoc)
        }
      } catch (verErr) {
        dbug('Failed to increment jwt_version on signout:', verErr)
      }
      task('Signing out authenticated user... ')
      reply.code(204).send()
      task_end('Ok. ✔️ ')
      return
    } catch (e) {
      task_end(MSG_500_ERROR_MESSAGE)
      log_err_safe('Error attempting signout user', { error: e, user: req.user })
      reply.code(500).send(default_500_error_response(e))
      return
    }
  })
}

export default authentication