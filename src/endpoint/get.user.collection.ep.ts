import { FastifyReply } from 'fastify';
import { default_500_error_response } from '../business.logic/builder/JsonapiErrorBuilder';
import JsonapiResponseBuilder from '../business.logic/builder/JsonapiResponseBuilder';
import { read_user_collection, transform_user_doc } from '../model/user';
import { TUsersFastifyRequest } from '../schema/users';
import { ler, log_err } from '../utility/logging';
import { MSG_500_ERROR_MESSAGE } from '../constants.server';

export default async function get_user_collection_endpoint (
  req: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    const result = await read_user_collection(req);
    reply.code(200).send(
      JsonapiResponseBuilder.forCollection()
        .withMongoosePaginatedResult(result, 'users', transform_user_doc)
        .build()
    );
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('GET user collection', e);
    reply.code(500).send(default_500_error_response(e));
  }
}