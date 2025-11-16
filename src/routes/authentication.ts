import { FastifyRequest, FastifyReply, FastifyPluginAsync, RouteOptions } from 'fastify'
import { check_password } from '../business.logic/security'
import { defaultDialogAlertState as alert } from '../state/dialog'
import { IRequestAuth } from '../common.types'
import {
  default_401_error_response,
  default_500_error_response,
  shielded_401_error_response
} from '../business.logic/errors'
import {
  TJsonapiStateResponse,
  TNetState,
  MSG_500_ERROR_MESSAGE
} from '@tuber/shared'
import get_bootstrap_authenticated_state from '../state/bootstrap'
import { get_ciphered_user, read_user } from '../model/session'
import {  get_theme_mode, option } from '../business.logic'
import { USER_CACHE } from '../business.logic/cache'
import { log_safe, log_err_safe, task, task_end, dbug } from '../utility/logging'
import { TCipheredUser } from '../schema/users'
import JsonapiRequestDriver from '../business.logic/JsonapiRequestDriver'
import { assure } from '../utility'
import RequestDataValidator from '../business.logic/RequestDataValidator'
import signInFormState from '../state/form/sign.in.form.state'
import { blacklist_token } from '../model/blacklisted-token'
import { MISSING_ACCESS_TOKEN, DEFAULT_AUTH_HEADER } from '@tuber/shared'
import { authorize_request } from '../middleware/on.request'
import Config from '../config'

const authentication: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = { ...rootOpts }

  fastify.post('/signin', opts, async function  (
    req: FastifyRequest<IRequestAuth>,
    reply: FastifyReply,
  ) {
    const driver = new JsonapiRequestDriver(req.body)
    const credentials = assure(driver.getAttribute('credentials'))
    const { username, password, options: o } = credentials
    const validator = new RequestDataValidator(credentials, signInFormState)
    log_safe('Authenticating user request:', req.body)
    task('Authenticating user... ')
    const errorResponse = validator.validateAgainstFormState()
    if (errorResponse) {
      task_end('Failed. Malformed request.')
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
              USER_CACHE.set(user.name, user)
              const usr = get_ciphered_user(user)
              const expiresIn = option<string>(o)('keep-signed-in', '60d', '1d')
              const token = await reply.jwtSign(usr, { expiresIn })
              task_end('Successs! User authenticated.')
              dbug('Session expires in', expiresIn === '60d'
                ? '2 months.'
                : '24 hours.'
              )
              const theme = get_theme_mode(req.cookie) // get_theme_mode(req.body.cookie)
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
          ...alert((e as Error).message),
          ...default_500_error_response(e)
        } as TNetState)
        return
      }
    }
    const title = 'Wrong username or password!'
    task_end(`Failed. ${title}`)
    reply.code(401).send({
      ...alert(title),
      ...default_401_error_response({ title })
    })
  })

  const signoutOpts: Partial<RouteOptions> = {
    ...opts,
    onRequest: async (req, reply, done): Promise<void> => {
      try {
        await authorize_request(req)
      } catch (e) {
        // Allow access if app is in development mode.
        if (Config.DEV) {
          done()
        } else {
          reply.code(401).send(shielded_401_error_response())
        }
      }
    }
  }

  fastify.post('/signout', signoutOpts, async function (
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { name } = req.user as TCipheredUser
      
      // Extract the JWT token from the Authorization header
      const authHeader = req.headers['authorization'] || DEFAULT_AUTH_HEADER
      const token = authHeader.split(' ')[1]
      
      if (token && token !== MISSING_ACCESS_TOKEN) {
        // Decode the token payload to get expiration time
        try {
          const payload = token.split('.')[1]
          const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString())
          const expiresAt = decodedPayload?.exp ? new Date(decodedPayload.exp * 1000) : new Date(Date.now() + 24 * 60 * 60 * 1000) // fallback to 24 hours
          
          // Blacklist the token
          await blacklist_token(token, expiresAt, 'user_signout')
          dbug('Token blacklisted for user:', name)
        } catch (decodeError) {
          // If decoding fails, use fallback expiration
          const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
          await blacklist_token(token, expiresAt, 'user_signout')
          dbug('Token blacklisted with fallback expiration for user:', name)
        }
      }

      task('Signing out authenticated user... ')
      USER_CACHE.del(name)
      task_end('Done.')
      reply.code(204).send()
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