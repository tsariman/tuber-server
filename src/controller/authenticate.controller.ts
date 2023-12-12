import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
import { check_password } from '../business.logic/security'
import Config from '../config'
import { UserPaginationModel } from '../model/user'
import { defaultDialogAlertState as alert } from '../state/dialog'
import { TCipheredUser } from '../schema/users'
import { ISignInCredentials } from '../business.logic/security/permissions'
import {
  default_401_error_response,
  default_500_error_response
} from '../business.logic/jsonapi.error.builder'
import { MSG_500_ERROR_MESSAGE, THEME_MODE } from '../constants'
import get_bootstrap_state from 'src/state/bootstrap.state'
import { TNetState } from '../common.types'

export default async function authentication_controller (fastify: FastifyInstance) {

  fastify.post('/', {}, async function  (
    req: FastifyRequest<ISignInCredentials>,
    reply: FastifyReply,
  ) {
    const credentials = req.body.credentials ?? {}
    const { username, password } = credentials
    Config.log(`username: '${username}', password: '${password}'`)
    Config.print('Authenticating user... ')
    if (username) {
      try {
        const user = await UserPaginationModel.findOne({ name: username })
        if (user) {
          if (password && user.password) {
            const passwordCorrect = await check_password(password, user.password)
            if (passwordCorrect) {
              const { name, role, jwt_version } = user
              const usr: TCipheredUser = { name, role, jwt_version }
              const token = await reply.jwtSign(usr)
              Config.USER_CACHE.set(name, usr)
              Config.log('Successs!')
              const mode = Config.read(THEME_MODE, 'light')
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
    reply.code(401).send({
      ...alert(title),
      ...default_401_error_response({ title })
    })
    // reply.send({
    //   state: {
    //     // app: { route: '/' },
    //     dialog: { open: false }
    //   }
    // })
  })

}
