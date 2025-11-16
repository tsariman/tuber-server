import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import { errr } from '../../utility/logging'
import { ensureDefaultUserExists } from '../../business.logic/ensure.default.user'
import { defaultDialogAlertState as alert } from '../../state/dialog'
import type { IQueryDirective } from '../../common.types'

/** `POST /dev/users` */
const dev_post_user_endpoint = async (
  req: FastifyRequest<IQueryDirective>,
  reply: FastifyReply
) => {
  try {
    switch (req.query.d) {
      case 'create-default-user': // Optional: Try to create default user if none exist (useful for empty database scenario)
        const defaultUserCreated = await ensureDefaultUserExists()
        if (defaultUserCreated) {
          const message = 'A default admin user has been created (admin/admin123).'
          reply.code(200).send(alert(message))
          return
        }
        reply.code(409).send(new JsonapiErrorBuilder()
          .withStatus(409)
          .withCode('OPERATION_NOT_ALLOWED')
          .build()
        )
        return
      
      // TODO - Add more cases here
      
      default:
        reply.code(400).send(new JsonapiErrorBuilder()
          .withStatus(400)
          .withCode('BAD_VALUE')
          .withTitle('Unrecognized directive')
          .build()
        )
        return
    }
  } catch (e) {
    errr(e)
    reply.code(500).send(default_500_error_response(e))
  }
}

export default dev_post_user_endpoint