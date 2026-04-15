import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { read_user_by_name, transform_user_doc } from '../../model/user'
import { TUsersFastifyRequest } from '../../schema/user'
import Access from '../../business.logic/security/Access'
import { error_id } from '../../business.logic/errors'
import { ler, log_err } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'

/** `GET /users/:name` endpoint handler */
export default async function get_user_by_name_endpoint (
  request: TUsersFastifyRequest<'name'>,
  reply: FastifyReply
) {
  try {
    const user = await read_user_by_name(request.params.name)
    if (user) {
      if (Access.the(request.usr).cannotReadSensitive(user)) {
        reply.code(403).send(new JsonapiErrorBuilder()
          .withStatus(403)
          .withTitle('Forbidden')
          .withDetail('You do not have permission to view this user\'s sensitive information.')
          .build())
        return
      }
      reply.code(200).send(
        JsonapiResponseBuilder.forSingleResource(transform_user_doc(user), 'users').build()
      )
      return
    }
    reply.code(404).send(new JsonapiErrorBuilder()
      .withStatus(404)
      .withTitle('Not Found')
      .withDetail(`User '${request.params.name}' not found.`)
      .build())
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50042]'))
    log_err('[50042] GET user by name', e)
    reply.code(500).send(error_id(50042).default_500_error_response(e))
  }
}