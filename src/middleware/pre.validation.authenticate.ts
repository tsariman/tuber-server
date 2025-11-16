import { FastifyRequest, RouteShorthandOptions } from 'fastify'
import { log, ler as err } from '../utility/logging'
import { UserPaginationModel } from '../model/user'
import { check_password } from '../business.logic/security'
import { defaultDialogAlertState as alert } from '../state/dialog'
import { IRequestAuth } from '../common.types'
import { default_500_error_response } from '../business.logic/errors'
import JsonapiRequestDriver from '../business.logic/JsonapiRequestDriver'
import { assure } from '../utility'

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
 * @deprecated
 */
const authenticate: RouteShorthandOptions['preValidation'] = async function (
  req,
  reply,
  done
) {
  const driver = new JsonapiRequestDriver(
    (req as FastifyRequest<IRequestAuth>).body
  )
  const credentials = driver.getAttribute('credentials')
  const { username, password } = assure(credentials)
  if (username) {
    log(`username: '${username}', password: '[REDACTED]'`)
    try {
      const user = await UserPaginationModel.findOne({ name: username })
      if (user) {
        if (password && user.password) {
          const passwordCorrect = await check_password(password, user.password)
          if (passwordCorrect) {
            // [TODO] Write session related logic here
            done()
          }
        } else if (!password && !user.password) {
          // [TODO] Write session related logic here
          done()
        }
      }
    } catch (e) {
      err(`[ERROR] ${(e as Error).message}`)
      reply.code(500).send(default_500_error_response(e))
    }
  }
  reply.send(alert('Wrong username or password!'))
}

export default authenticate