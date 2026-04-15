import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { ler, log_err } from '../../utility/logging'
import type { IQueryDirective } from '../../common.types'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'

/** `POST /dev/users` */
const dev_post_user_endpoint = async (
  req: FastifyRequest<IQueryDirective>,
  reply: FastifyReply
) => {
  try {
    switch (req.query.d) {
      case 'create-default-user': // Optional: Try to create default user if none exist (useful for empty database scenario)
        return
      
      // TODO - Add more cases here
      
      default:
        reply.code(400).send(new JsonapiErrorBuilder()
          .withStatus(400)
          .withCode('BAD_VALUE')
          .withTitle('Unrecognized directive')
          .build()
        )
        return
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50031]'))
    log_err('[50031] DEV POST user endpoint', e)
    reply.code(500).send(error_id(50031).default_500_error_response(e))
  }
}

export default dev_post_user_endpoint