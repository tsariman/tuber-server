import { FastifyReply } from 'fastify'
import { generic_500_error_response } from '../business.logic/jsonapi.error.builder'
import { TUsersFastifyRequest } from '../schema/users'

export default async function demo_users_get_collection_endpoint (
  _req: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    reply.code(200).send({
      data: []
    })
  } catch (e: any) {
    reply.code(500).send(generic_500_error_response(e))
  }
}