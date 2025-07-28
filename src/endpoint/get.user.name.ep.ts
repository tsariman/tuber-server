import { FastifyReply } from 'fastify';
import JsonapiErrorBuilder from '../business.logic/builder/jsonapi.error.builder';
import JsonapiResponseBuilder from '../business.logic/builder/jsonapi.response.builder';
import { get_user_by_name } from '../model/user';
import { TUsersFastifyRequest } from '../schema/users';

export default async function get_user_by_name_endpoint (
  request: TUsersFastifyRequest,
  reply: FastifyReply
) {
  const user = await get_user_by_name(request.params.name);
  if (user) {
    reply.code(200).send(
      new JsonapiResponseBuilder(user, 'users', 'object').mPaginationV2build()
    );
  }
  reply.code(404).send(new JsonapiErrorBuilder()
    .withStatus(404)
    .withTitle('Not Found')
    .withDetail(`User '${request.params.name}' not found.`)
    .build()
  );
}