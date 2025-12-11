import { FastifyReply } from 'fastify'
import { MONGODB_DUPLICATE_KEY_ERROR, get_mongodb_error } from '../../business.logic/errors'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { create_user } from '../../model/user'
import { TUsersFastifyRequest } from '../../schema/user'
import { ler, log_err } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import RequestDataValidator from '../../business.logic/RequestDataValidator'
import newUserFormState from '../../state/form/new.user.form.state'

/** `POST /users` endpoint handler */
export default async function post_user_endpoint (
  req: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    const newUserResource = new JsonapiRequestDriver(req.body).getAttributes()
    if (newUserResource) {
      const validator = new RequestDataValidator(newUserResource, newUserFormState)
      const errorResponse = validator.validateAgainstFormState()
      if (errorResponse) {
        reply.code(400).send(errorResponse)
        return
      }
      const user = await create_user(newUserResource)
      reply.code(201).send(
        JsonapiResponseBuilder.forSingleResource(user, 'users')
          .withState({
            'app': {
              'route': 'default-success',
            },
            'tmp': {
              'default-success': `User ${user.name} successfully created!`
            }
          })
          .build()
      )
    }
  } catch (e) {
    const errorMessage = e instanceof Error ? e.message : String(e)
    const mongoDbError = get_mongodb_error(errorMessage)
    if (mongoDbError.code === MONGODB_DUPLICATE_KEY_ERROR) {
      reply.code(409).send(new JsonapiErrorBuilder()
        .withCode('DUPLICATE_RESOURCE')
        .withStatus(409)
        .withTitle('Conflict')
        .withDetail(mongoDbError.detail)
        .build()
      );
    } else {
      ler(MSG_500_ERROR_MESSAGE)
      log_err('POST user', e)
      reply.code(500).send(default_500_error_response(e))
    }
  }
}
