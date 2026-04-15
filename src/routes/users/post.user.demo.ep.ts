import { FastifyReply } from 'fastify'
import {
  MONGODB_DUPLICATE_KEY_ERROR,
  error_id,
  get_mongodb_error
} from '../../business.logic/errors'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
// import { create_user } from '../model/user'
import { TUsersFastifyRequest } from '../../schema/user'
import { ler, log_err } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'

/**
 * Creating a user is disabled, for now.  
 * [TODO][TRAFFIC] Save new users to `users_demo` collection.
 *
 * @param request 
 * @param reply 
 */
export default async function post_demo_user_endpoint (
  req: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    // const user = await create_user(req.body)
    reply.code(201).send(
      JsonapiResponseBuilder.forSingleResource(req.body, 'users').build()
    )
  } catch (e) {
    const mongoDbError = get_mongodb_error((e as Error).message)
    if (mongoDbError.code === MONGODB_DUPLICATE_KEY_ERROR) {
      reply.code(409).send(new JsonapiErrorBuilder()
        .withCode('DUPLICATE_RESOURCE')
        .withStatus(409)
        .withTitle('Conflict')
        .withDetail(mongoDbError.detail)
        .build())
    } else {
      ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50046]'))
      log_err('[50046] POST demo user', e)
      reply.code(500).send(error_id(50046).default_500_error_response(e))
    }
  }
}
