import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from 'src/business.logic/jsonapi.response.builder'
import { get_user_by_name } from 'src/model/user'
import { TUsersFastifyRequest } from 'src/schema/users'

export default async function users_get_by_name_endpoint (
  request: TUsersFastifyRequest,
  reply: FastifyReply
) {
  const user = await get_user_by_name(request.params.name)
  if (user) {
    reply.code(200).send(
      new JsonapiResponseBuilder(user, 'users', 'object').build()
    )
  }
  reply.code(404).send(new JsonapiErrorBuilder()
    .status(404)
    .title('Not Found')
    .detail(`User '${request.params.name}' not found.`)
    .build()
  )
}