import { FastifyReply } from 'fastify';
import { MONGODB_DUPLICATE_KEY_ERROR, get_mongodb_error } from '../business.logic/errors';
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../business.logic/builder/jsonapi.error.builder';
import JsonapiResponseColBuilder from '../business.logic/builder/jsonapi.response.col.builder';
import { create_user } from '../model/user';
import { TUsersFastifyRequest } from '../schema/users';
import { ler, log_err } from '../utility/logging';
import { MSG_500_ERROR_MESSAGE } from '../constants.server';

export default async function post_user_endpoint (
  request: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = await create_user(request.body);
    reply.code(201).send(
      new JsonapiResponseColBuilder(user, 'users', 'object').mPaginationV2build()
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
      ler(MSG_500_ERROR_MESSAGE);
      log_err('POST user', e);
      reply.code(500).send(default_500_error_response(e));
    }
  }
}
