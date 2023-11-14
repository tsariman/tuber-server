import { FastifyInstance } from 'fastify'
import users_get_collection_endpoint from '../endpoint/users.get.ep'
import users_get_by_name_endpoint from '../endpoint/users.get.name.ep'
import users_post_endpoint from '../endpoint/users.post.ep'
import { DEFAULT_OPTIONS } from '../middleware/router.option'
import { IUsersEndpoint } from '../schema/users'
import Config from '../config'
import demo_users_post_endpoint from 'src/endpoint/demo.users.post.ep'
import demo_users_get_collection_endpoint from 'src/endpoint/demo.users.get.ep'

const opts = {
  ...DEFAULT_OPTIONS,
}

const getUsersEndpointSwitch = Config.DEMO
  ? demo_users_get_collection_endpoint
  : users_get_collection_endpoint

const postUsersEnpointSwitch = Config.DEMO
  ? demo_users_post_endpoint
  : users_post_endpoint

export default async function users_controller(fastify: FastifyInstance) {
  // GET /users
  fastify.get<IUsersEndpoint>('/', opts, getUsersEndpointSwitch)
  // GET /users/:name
  fastify.get<IUsersEndpoint>('/:name', opts, users_get_by_name_endpoint)
  // POST /users
  fastify.post<IUsersEndpoint>('/', opts, postUsersEnpointSwitch)

  // PUT /users/:id (update)

  // DELETE /users/:id (delete)
}
