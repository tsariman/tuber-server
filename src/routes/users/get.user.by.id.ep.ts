import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { read_user_by_id } from '../../model/user'
import { TUsersFastifyRequest } from '../../schema/user'
import { ler, log_err } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import Access from '../../business.logic/security/Access'

export default async function get_user_by_id_endpoint (
  req: TUsersFastifyRequest<'id'>,
  reply: FastifyReply
) {
  try {
    const user = await read_user_by_id(req.params.id)
    if (user) {
      if (Access.the(req.usr).cannotReadSensitive(user)) {
        reply.code(403).send(new JsonapiErrorBuilder()
          .withStatus(403)
          .withTitle('Forbidden')
          .withDetail('You do not have permission to view this user\'s sensitive information.')
          .build()
        )
        return
      }
      reply.code(200).send(
        JsonapiResponseBuilder.forSingleResource(user, 'users')
          .withId(user._id)
          .build()
      )
    } else {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withTitle('Not Found')
        .withDetail(`User with id '${req.params.id}' not found.`)
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE)
    log_err('GET user by id', e)
    reply.code(500).send(default_500_error_response(e))
  }
}