import { FastifyReply } from 'fastify';
import {
  MONGODB_DUPLICATE_KEY_ERROR,
  get_mongodb_error
} from '../business.logic/errors';
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../business.logic/builder/jsonapi.error.builder';
import JsonapiResponseBuilder from '../business.logic/builder/jsonapi.response.builder';
// import { create_user } from '../model/user'
import { TUsersFastifyRequest } from '../schema/users';
import { log } from '../utility/logging';
import { MSG_500_ERROR_MESSAGE } from '../constants.server';

/**
 * Creating a user is disabled, for now.  
 * [TODO][TRAFFIC] Save new users to `users_demo` collection.
 *
 * @param request 
 * @param reply 
 */
export default async function post_demo_users_endpoint (
  req: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    // const user = await create_user(req.body)
    reply.code(201).send(
      JsonapiResponseBuilder.forSingleResource(req.body, 'users').build()
    );
  } catch (e) {
    const mongoDbError = get_mongodb_error((e as Error).message);
    if (mongoDbError.code === MONGODB_DUPLICATE_KEY_ERROR) {
      reply.code(409).send(new JsonapiErrorBuilder()
        .withCode(mongoDbError.code)
        .withStatus(409)
        .withTitle('Conflict')
        .withDetail(mongoDbError.detail)
        .build()
      );
    } else {
      log(MSG_500_ERROR_MESSAGE, e);
      reply.code(500).send(default_500_error_response(e));
    }
  }
}
