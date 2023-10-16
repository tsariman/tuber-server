import { FastifyReply } from 'fastify'
import { MONGODB_DUPLICATE_KEY_ERROR, get_mongodb_error } from '../business.logic/errors'
import JsonapiErrorBuilder from '../business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from '../business.logic/jsonapi.response.builder'
import { create_user } from '../model/user'
import { TUsersFastifyRequest } from '../schema/users'

export default async function users_post_endpoint (
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
      reply.code(500).send(errors.status(500)
        .title('Internal Server Error')
        .build()
      )
    }
  }
}
