import { FastifyInstance, FastifyRequest, FastifyReply, RouteShorthandOptions } from 'fastify'
import users_post from './middleware/post.users.endpoint'
import authenticate from 'src/controller/router.option/pre.validation.authenticate'

const opts: RouteShorthandOptions = {
  preValidation: authenticate,

  // TODO Add custom route options here
}

export default async function usersController(fastify: FastifyInstance) {
  // GET /api/v1/user
  fastify.get('/', opts, async function (
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

  fastify.post('/', opts, users_post)

}
