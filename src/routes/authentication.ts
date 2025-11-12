import { FastifyRequest, FastifyReply, FastifyPluginAsync } from 'fastify'
import { check_password } from '../business.logic/security'
import { defaultDialogAlertState as alert } from '../state/dialog'
import { IRequestAuth } from '../business.logic/security/permissions'
import {
  default_401_error_response,
  default_500_error_response
} from '../business.logic/errors'
import {
  TJsonapiStateResponse,
  TNetState,
  MSG_500_ERROR_MESSAGE
} from '@tuber/shared'
import get_bootstrap_authenticated_state from '../state/bootstrap'
import { read_ciphered_user, read_user } from '../model/session'
import {  get_theme_mode, option } from '../business.logic'
import { ensureDefaultUserExists } from '../business.logic/ensure.default.user'
import { USER_CACHE } from '../business.logic/cache'
import {
  ler,
  log,
  log_safe,
  log_err_safe,
  task,
  task_end
} from '../utility/logging'
import { TCipheredUser } from '../schema/users'
import JsonapiRequestDriver from '../business.logic/JsonapiRequestDriver'
import { ensure } from '../utility'
import { DEFAULT_ROUTE_OPTIONS } from '../middleware/router.option'
import RequestDataValidator from '../business.logic/RequestDataValidator'
import signInFormState from '../state/form/sign.in.form.state'

const authentication: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = { ...rootOpts }

  fastify.post('/signin', opts, async function  (
    req: FastifyRequest<IRequestAuth>,
    reply: FastifyReply,
  ) {
    const driver = new JsonapiRequestDriver(req.body)
    const credentials = ensure(driver.getAttribute('credentials'))
    const { username, password, options: o } = credentials
    const validator = new RequestDataValidator(credentials, signInFormState)
    log_safe('Authenticating user request:', req.body)
    task('Authenticating user... ')
    const errorResponse = validator.validateAgainstFormState()
    if (errorResponse) {
      task_end('Failed. Invalid values detected.')
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
              const usr = read_ciphered_user(user)
              const expiresIn = option<string>(o)('keep-signed-in', '2mo', '1d')
              const token = await reply.jwtSign(usr, { expiresIn })
              task_end('Successs! User authenticated.')
              log('Session expires in', expiresIn === '2mo'
                ? '2 months.'
                : '24 hours.'
              )
              const theme = get_theme_mode(driver.getAttribute('cookie')) // get_theme_mode(req.body.cookie)
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

    // Optional: Try to create default user if none exist (useful for empty database scenario)
    try {
      const defaultUserCreated = await ensureDefaultUserExists()
      if (defaultUserCreated) {
        const additionalMessage = ' A default admin user has been created (admin/admin123).'
        reply.code(401).send({
          ...alert(title + additionalMessage),
          ...default_401_error_response({ title: title + additionalMessage })
        })
        return
      }
    } catch (e) {
      ler('Failed to create default user:', e)
    }

    reply.code(401).send({
      ...alert(title),
      ...default_401_error_response({ title })
    })
  })

  const signOutOpts = {
    ...opts,
    ...DEFAULT_ROUTE_OPTIONS
  }

  fastify.post('/signout', signOutOpts, async function (
    req: FastifyRequest,
    reply: FastifyReply
  ) {
    task('Signing out authenticated user... ')
    try {
      const { name } = req.user as TCipheredUser
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