import { RouteShorthandOptions } from 'fastify'
import { connect, disconnect } from 'mongoose'
import Config from 'src/config'
import { UserModel } from 'src/model/user'
import { check_password } from 'src/business.logic/security'
import { defaultDialogAlertJson as alert } from 'src/state/dialogs'
import { ILoginCredentials } from 'src/business.logic/security/permissions'



/**
 * [TODO] #1 In authentication, when the user successfully logs in using their
 *           credentials, a JSON Web Token will be returned.
 *        #2 Since tokens are credentials, great care must be taken to prevent
 *           security issues. In general, you should not keep tokens longer
 *           than required.
 *        #3 Whenever the user wants to access a protected route or resource,
 *           the user agent should send the JWT, typically in the Authorization
 *           header using the Bearer schema. The content of the header should
 *           look like the following:
 *        #4
 *
 * ```
 * Authorization: Bearer <token>
 * ```
 * 
 * @param request 
 * @param reply 
 * @param done
 *
 * @see https://jwt.io/introduction
 * @see https://compile7.org/decompile/authorization-request-headers-explained/
 */
const authenticate: RouteShorthandOptions['preValidation'] = async function (
  request, reply, done
) {
  process.stdout.write('Working on pre validation authentication... ')
  await connect(Config.DB_URL)
  const { username, password } = request.body as ILoginCredentials









  if (username) {
    console.log(`username: '${username}', password: '${password}'`)
    try {
      const user = await UserModel.findOne({ name: username })
      if (user) {
        if (user.password) {
          const passwordCorrect = await check_password(password, user.password)
          if (passwordCorrect) {
            // [TODO] Write session related logic here
            done()
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
}

export default authenticate