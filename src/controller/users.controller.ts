import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import post_users_ep from '../endpoint/post.users.ep'

export default async function users_controller(fastify: FastifyInstance) {
  // GET /api/v1/user
  fastify.get('/', async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    reply.send({
      balance: '$3,277.32',
      picture: 'http://placehold.it/32x32',
      age: 30,
      name: 'Leonor Cross',
      gender: 'female',
      company: 'GRONK',
      email: 'leonorcross@gronk.com',
    })
  })

  fastify.post('/', post_users_ep)

}
