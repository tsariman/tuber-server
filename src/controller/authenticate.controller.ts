import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import { check_password } from '../business.logic/security'
import Config from '../config'
import { defaultDialogAlertState as alert } from '../state/dialog'
import { ISignInCredentials } from '../business.logic/security/permissions'
import {
  default_401_error_response,
  default_500_error_response
} from '../business.logic/jsonapi.error.builder'
import { MSG_500_ERROR_MESSAGE } from '../constants'
import get_bootstrap_state from 'src/state/bootstrap.state'
import { TNetState } from '../common.types'
import { get_ciphered_user, get_user } from 'src/model/session'
import {  get_theme_mode, option } from '../business.logic'

export default async function authentication_controller (fastify: FastifyInstance) {

  fastify.post('/', {}, async function  (
    req: FastifyRequest<ISignInCredentials>,
    reply: FastifyReply,
  ) {
    const credentials = req.body.credentials ?? {}
    const { username, password, options: o } = credentials
    Config.log(`[DEBUG] req.body:`, req.body)
    Config.print('[DEBUG] Authenticating user... ')
    if (username) {
      try {
        const user = await get_user({ name: username }) // uses cache internally
        if (user) {
          if (password && user.password) {
            const passwordCorrect = await check_password(password, user.password)
            if (passwordCorrect) {
              Config.USER_CACHE.set(user.name, user)
              const usr = get_ciphered_user(user)
              const expiresIn = option<string>(o)('keep-signed-in', '2M', '1d')
              const token = await reply.jwtSign(usr, {
                expiresIn
              })
              Config.log('Successs! User authenticated.')
              Config.log('[DEBUG] Session expires in', expiresIn === '2M'
                ? '2 months.'
                : '24 hours.'
              )
              const mode = get_theme_mode(req.body.cookie)
              reply
                .code(200)
                .send({
                  'state': await get_bootstrap_state({
                    usr,
                    token,
                    mode
                  })
                })
              return
            }
          }
        }
      } catch (e: any) {
        Config.log(MSG_500_ERROR_MESSAGE, e)
        reply.code(500).send({
          ...alert(e.message),
          ...default_500_error_response(e)
        } as TNetState)
        return
      }
    }
    const title = 'Wrong username or password!'
    Config.log(`Failed. '${title}'`)
    reply.code(401).send({
      ...alert(title),
      ...default_401_error_response({ title })
    })
  })

}
