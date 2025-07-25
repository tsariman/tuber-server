import { FastifyReply } from 'fastify';
import { default_500_error_response } from '../business.logic/builder/jsonapi.error.builder';
import { TUsersFastifyRequest } from '../schema/users';
import Config from '../config';
import { MSG_500_ERROR_MESSAGE } from '../constants';

export default async function demo_users_get_collection_endpoint (
  _req: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    reply.code(200).send({
      data: []
    });
  } catch (e) {
    Config.log(MSG_500_ERROR_MESSAGE, e);
    reply.code(500).send(default_500_error_response(e));
  }
}