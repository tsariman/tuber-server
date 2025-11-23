import { FastifyReply } from 'fastify';
import { MONGODB_DUPLICATE_KEY_ERROR, get_mongodb_error } from '../../business.logic/errors';
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder';
import { default_500_error_response } from '../../business.logic/errors'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder';
import { create_user } from '../../model/user';
import { TUsersFastifyRequest } from '../../schema/user';
import { ler, log_err } from '../../utility/logging';
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared';

export default async function post_user_endpoint (
  request: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    const user = await create_user(request.body);
    reply.code(201).send(
      JsonapiResponseBuilder.forSingleResource(user, 'users').build()
    );
  } catch (e) {
    const mongoDbError = get_mongodb_error((e as Error).message);
    if (mongoDbError.code === MONGODB_DUPLICATE_KEY_ERROR) {
      reply.code(409).send(new JsonapiErrorBuilder()
        .withCode('DUPLICATE_RESOURCE')
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
