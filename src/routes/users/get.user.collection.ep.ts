import { FastifyReply } from 'fastify'
import { error_id } from '../../business.logic/errors'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { read_user_collection, transform_user_doc } from '../../model/user'
import { TUsersFastifyRequest } from '../../schema/user'
import { ler, log_err } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import Access from '../../business.logic/security/Access'

/** `GET /users` endpoint handler */
export default async function get_user_collection_endpoint (
  req: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    if (Access.the(req.usr).cannot('read.user.collection')) {
      reply.code(403).send(new JsonapiErrorBuilder()
        .withStatus(403)
        .withCode('INSUFFICIENT_PERMISSION')
        .withTitle('Forbidden')
        .withDetail('You do not have permission to access the user collection')
        .build())
      return
    }
    const result = await read_user_collection(req)
    reply.code(200).send(JsonapiResponseBuilder.forCollection()
      .withMongoosePaginatedResult(result, 'users', transform_user_doc)
      .build())
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5044]'))
    log_err('[5044] GET user collection', e)
    reply.code(500).send(error_id(5044).default_500_error_response(e))
  }
}