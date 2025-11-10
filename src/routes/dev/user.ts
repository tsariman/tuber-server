import { FastifyPluginAsync } from 'fastify'
import get_user_collection_endpoint from '../../handlers/get.user.collection.ep'
import get_user_by_name_endpoint from '../../handlers/get.user.by.name.ep'
import post_user_endpoint from '../../handlers/post.user.ep'
import { IUsersEndpoint } from '../../schema/users'

const users: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = { ...rootOpts }

  // GET /dev/users
  fastify.get<IUsersEndpoint>('/users', opts, get_user_collection_endpoint)
  // GET /dev/users/:name
  fastify.get<IUsersEndpoint>('/users/:name', opts, get_user_by_name_endpoint)
  // POST /dev/users
  fastify.post<IUsersEndpoint>('/users', opts, post_user_endpoint)

  // PUT /users/:id (update)

  // DELETE /users/:id (delete)
}

export default users