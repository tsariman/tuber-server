import { FastifyReply } from 'fastify'
import { error_id } from '../../business.logic/errors'
import { TUsersFastifyRequest } from '../../schema/user'
import { ler, log_err } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'

export default async function get_user_collection_demo_endpoint (
  _req: TUsersFastifyRequest<'name'>,
  reply: FastifyReply
) {
  try {
    reply.code(200).send({
      data: []
    })
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5043]'))
    log_err('[5043] GET user collection demo', e)
    reply.code(500).send(error_id(5043).default_500_error_response(e))
  }
}