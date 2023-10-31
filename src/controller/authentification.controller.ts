import { FastifyRequest, FastifyReply, FastifyInstance } from 'fastify'
// import { connect, disconnect } from 'mongoose'
import { check_password } from '../business.logic/security'
import Config from '../config'
import { UserPaginationModel } from '../model/user'
import { defaultDialogAlertState as alert } from '../state/dialog'
import jwt from 'jsonwebtoken'
import { TCipheredUser } from '../schema/users'
import { INetState } from '../../../tuber-client/src/controllers/interfaces/IState'
import { ILoginCredentials } from '../business.logic/security/permissions'

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
                } as INetState
              })
            }
          }
        }
      } catch (e: any) {
        console.error(e.message)
        // await disconnect()
        reply.send(alert(e.message))
      }
    }
    // await disconnect()
    reply.send(alert('Wrong username or password!'))
    reply.send({
      state: {
        // app: { route: '/' },
        dialog: { open: false }
      }
    })
  })

}
