import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
// import { connect, disconnect } from 'mongoose'
import { check_password } from '../business.logic/security'
import Config from '../config'
import { UserPaginationModel } from '../model/user'
import { defaultDialogAlertState as alert } from '../state/dialog'
import jwt from 'jsonwebtoken'
import { TCipheredUser } from '../schema/users'
import { ILoginCredentials } from '../business.logic/security/permissions'
import { TNetState } from '../common.types'
import { default_500_error_response } from '../business.logic/jsonapi.error.builder'
import { MSG_500_ERROR_MESSAGE } from '../constants'

export default async function authentification_controller (fastify: FastifyInstance) {

  fastify.post('/', async function  (
    request: FastifyRequest,
    reply: FastifyReply,
  ) {
    process.stdout.write('Authenticating user... ')
    // await connect(Config.DB_URI)
    const { username, password } = request.body as ILoginCredentials
    if (username) {
      Config.log(`username: '${username}', password: '${password}'`)
      try {
        const user = await UserPaginationModel.findOne({ name: username })
        if (user) {
          if (password && user.password) {
            const passwordCorrect = await check_password(password, user.password)
            if (passwordCorrect) {
              // [TODO] Write session related logic here
              const { _id, name, role, jwt_version } = user
              const usr: TCipheredUser = { _id, name, role, jwt_version }
              const accessToken = jwt.sign(usr, Config.ACCESS_TOKEN_SECRET)
              Config.USER_CACHE.set(name, usr)
              reply.send({
                'state': {
                  'app': {
                    'session': {
                      'name': name,
                      'accessToken': accessToken
                    }
                  }
                } as TNetState
              })
            }
          }
        }
      } catch (e: any) {
        Config.log(MSG_500_ERROR_MESSAGE, e)
        const alertDialog = alert(e.message).state.dialog
        reply.send({
          state: {
            dialog: alertDialog
          },
          ...default_500_error_response(e)
        })
      }
    }
    reply.send(alert('Wrong username or password!'))
    reply.send({
      state: {
        // app: { route: '/' },
        dialog: { open: false }
      }
    })
  })

}
