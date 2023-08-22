import { FastifyRequest, FastifyReply } from 'fastify'

export default async function users_post (
  _request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send({
    state: {
      app: {
        route: 'default-success'
      }
    }
  })
}