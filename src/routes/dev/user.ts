import { FastifyPluginAsync } from 'fastify'
import get_user_collection_endpoint from '../users/get.user.collection.ep'
import get_user_by_name_endpoint from '../users/get.user.by.name.ep'
import post_user_endpoint from '../users/post.user.ep'
import { IUsersEndpoint } from '../../schema/user'
import { put_user_vote_by_id_endpoint } from '../users/put.user.by.id.ep'

const users: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = { ...rootOpts }

  // GET /dev/users
  fastify.get<IUsersEndpoint>('/users', opts, get_user_collection_endpoint)
  // GET /dev/users/:name
  fastify.get<IUsersEndpoint>('/users/:name', opts, get_user_by_name_endpoint)
  // POST /dev/users
  fastify.post<IUsersEndpoint>('/users', opts, post_user_endpoint)

  // PUT /users/:id (update)
  // PUT /dev/users/:userId/vote (upvote/downvote)
  fastify.put('/users/:userId/vote', opts, put_user_vote_by_id_endpoint)

  // DELETE /users/:id (delete)
}

export default users