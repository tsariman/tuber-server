import { FastifyReply } from 'fastify';
import { default_500_error_response } from '../business.logic/builder/jsonapi.error.builder';
import JsonapiResponseColBuilder from '../business.logic/builder/jsonapi.response.col.builder';
import { exclude_user_fields, get_user_collection } from '../model/user';
import { TUsersFastifyRequest } from '../schema/users';
import { ler, log_err } from '../utility/logging';
import { MSG_500_ERROR_MESSAGE } from '../constants.server';

export default async function get_users_collection_endpoint (
  req: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    const result = await get_user_collection(req);
    const userDocs = result.docs;
    reply.code(200).send(
      new JsonapiResponseColBuilder(userDocs, 'users', 'collection')
      .setResourceFilter(exclude_user_fields)
      .buildPaginationV2Links(result)
      .mPaginationV2build()
    );
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('GET user collection', e);
    reply.code(500).send(default_500_error_response(e));
  }
}