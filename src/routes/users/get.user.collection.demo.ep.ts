import { FastifyReply } from 'fastify';
import { default_500_error_response } from '../../business.logic/errors';
import { TUsersFastifyRequest } from '../../schema/user';
import { ler, log_err } from '../../utility/logging';
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared';

export default async function get_user_collection_demo_endpoint (
  _req: TUsersFastifyRequest<'name'>,
  reply: FastifyReply
) {
  try {
    reply.code(200).send({
      data: []
    });
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('GET user collection demo', e);
    reply.code(500).send(default_500_error_response(e));
  }
}