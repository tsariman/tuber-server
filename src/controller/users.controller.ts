import { FastifyInstance } from 'fastify'
import users_get_collection_endpoint from '../endpoint/users.get.ep'
import users_get_by_name_endpoint from '../endpoint/users.get.name.ep'
import users_post_endpoint from '../endpoint/users.post.ep'
import { DEFAULT_OPTIONS } from '../middleware/router.option'
import { IUsersEndpoint } from '../schema/users'

const opts = {
  ...DEFAULT_OPTIONS,
}

export default async function users_controller(fastify: FastifyInstance) {
  // GET /users
  fastify.get<IUsersEndpoint>('/', opts, users_get_collection_endpoint)

  // GET /users/:name
  fastify.get<IUsersEndpoint>('/:name', opts, users_get_by_name_endpoint)

  // POST /users
  fastify.post<IUsersEndpoint>('/', opts, users_post_endpoint)

  // PUT /users/:id (update)

  // DELETE /users/:id (delete)
}
