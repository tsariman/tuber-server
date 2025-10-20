import { FastifyReply } from 'fastify';
import JsonapiErrorBuilder, { default_500_error_response } from '../business.logic/builder/jsonapi.error.builder';
import JsonapiResponseBuilder from '../business.logic/builder/jsonapi.response.builder';
import { read_user_by_id } from '../model/user';
import { TUsersFastifyRequest } from '../schema/users';
import { ler, log_err } from '../utility/logging';
import { MSG_500_ERROR_MESSAGE } from '../constants.server';

export default async function get_user_by_id_endpoint (
  req: TUsersFastifyRequest<'id'>,
  reply: FastifyReply
) {
  try {
    const user = await read_user_by_id(req.params.id);
    if (user) {
      reply.code(200).send(
        JsonapiResponseBuilder.forSingleResource(user, 'users')
          .withId(user._id)
          .build()
      );
    } else {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withTitle('Not Found')
        .withDetail(`User with id '${req.params.id}' not found.`)
        .build()
      );
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('GET user by id', e);
    reply.code(500).send(default_500_error_response(e));
  }
}