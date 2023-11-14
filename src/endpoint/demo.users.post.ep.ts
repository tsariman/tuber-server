import { FastifyReply } from 'fastify'
import { MONGODB_DUPLICATE_KEY_ERROR, get_mongodb_error } from '../business.logic/errors'
import JsonapiErrorBuilder, { generic_500_error_response } from '../business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from '../business.logic/jsonapi.response.builder'
// import { create_user } from '../model/user'
import { TUsersFastifyRequest } from '../schema/users'

/**
 * Creating a user is disabled, for now.  
 * [TODO][TRAFFIC] Save new users to `users_demo` collection.
 *
 * @param request 
 * @param reply 
 */
export default async function demo_users_post_endpoint (
  req: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    // const user = await create_user(req.body)
    reply.code(201).send(
      new JsonapiResponseBuilder(req.body, 'users', 'object').mPaginationV2build()
    )
  } catch (e: any) {
    const mongoDbError = get_mongodb_error(e.message)
    if (mongoDbError.code === MONGODB_DUPLICATE_KEY_ERROR) {
      reply.code(409).send(new JsonapiErrorBuilder()
        .code(mongoDbError.code)
        .status(409)
        .title('Conflict')
        .detail(mongoDbError.detail)
        .build()
      )
    } else {
      reply.code(500).send(generic_500_error_response(e))
    }
  }
}
