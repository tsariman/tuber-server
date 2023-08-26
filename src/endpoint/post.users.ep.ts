import { FastifyRequest, FastifyReply } from 'fastify'
import { connect, disconnect } from 'mongoose'
import { check_password } from 'src/business.logic/security'
import Config from 'src/config'
import { UserModel } from 'src/model/user'
import { ILoginCredentials } from 'src/utility/common.types'
import { defaultDialogAlertJson as alert } from 'src/state/dialogs'
import jwt from 'jsonwebtoken'
import { TCipheredUser } from 'src/schema/users'
import { INetState } from '../../../tuber-client/src/controllers/interfaces/IState'

export default async function post_users_ep (
  request: FastifyRequest,
  reply: FastifyReply,
) {
  process.stdout.write('Authenticating user... ')
  await connect(Config.DB_URL)
  const { username, password } = request.body as ILoginCredentials
  if (username) {
    console.log(`username: '${username}', password: '${password}'`)
    try {
      const user = await UserModel.findOne({ name: username })
      if (user) {
        if (password && user.password) {
          const passwordCorrect = await check_password(password, user.password)
          if (passwordCorrect) {
            // [TODO] Write session related logic here
            const { name, jwt_version } = user
            const usr: TCipheredUser = { name, jwt_version }
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
      await disconnect()
      reply.send(alert(e.message))
    }
  }
  await disconnect()
  reply.send(alert('Wrong username or password!'))
  reply.send({
    state: {
      // app: { route: '/' },
      dialog: { open: false }
    }
  })
}