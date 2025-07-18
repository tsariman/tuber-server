import { FastifyReply } from 'fastify'
import { MONGODB_DUPLICATE_KEY_ERROR, get_mongodb_error } from '../business.logic/errors'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../business.logic/builder/jsonapi.error.builder'
import JsonapiResponseBuilder from '../business.logic/builder/jsonapi.response.builder'
import { create_user } from '../model/user'
import { TUsersFastifyRequest } from '../schema/users'
import Config from '../config'
import { MSG_500_ERROR_MESSAGE } from '../constants'

export default async function post_users_endpoint (
  request: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = await create_user(request.body)
    reply.code(201).send(
      new JsonapiResponseBuilder(user, 'users', 'object').mPaginationV2build()
    )
  } catch (e: any) {
    const mongoDbError = get_mongodb_error(e.message)
    const errors = new JsonapiErrorBuilder()
    if (mongoDbError.code === MONGODB_DUPLICATE_KEY_ERROR) {
      reply.code(409).send(errors.code(mongoDbError.code)
        .status(409)
        .title('Conflict')
        .detail(mongoDbError.detail)
        .build()
      )
    } else {
      Config.log(MSG_500_ERROR_MESSAGE, e)
      reply.code(500).send(default_500_error_response(e))
    }
  }
}
