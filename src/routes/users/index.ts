import { FastifyPluginAsync } from 'fastify'
import get_user_collection_endpoint from './get.user.collection.ep'
import get_user_by_name_endpoint from './get.user.by.name.ep'
import post_user_endpoint from './post.user.ep'
import { DEFAULT_ROUTE_OPTIONS } from '../../middleware/router.option'
import { IUsersEndpoint, IUsersVoteEndpoint } from '../../schema/user'
import Config from '../../config'
import post_demo_user_endpoint from './post.user.demo.ep'
import get_user_collection_demo_endpoint from './get.user.collection.demo.ep'
import { put_user_vote_by_id_endpoint } from './put.user.by.id.ep'

const get_user_endpoint_switch = Config.DEMO
  ? get_user_collection_demo_endpoint
  : get_user_collection_endpoint

const post_user_enpoint_switch = Config.DEMO
  ? post_demo_user_endpoint
  : post_user_endpoint

const users: FastifyPluginAsync = async (fastify, defaultOpts): Promise<void> => {

  const opts = {
    ...defaultOpts,
    ...DEFAULT_ROUTE_OPTIONS,
  }

  // GET /users
  fastify.get<IUsersEndpoint>('/users', opts, get_user_endpoint_switch)
  // GET /users/:name
  fastify.get<IUsersEndpoint>('/users/:name', opts, get_user_by_name_endpoint)
  // POST /users
  fastify.post<IUsersEndpoint>('/users', opts, post_user_enpoint_switch)

  // PUT /users/:id (update)
  // PUT /users/:userId/vote (upvote/downvote)
  fastify.put<IUsersVoteEndpoint>('/users/:userId/vote', opts, put_user_vote_by_id_endpoint)

  // DELETE /users/:id (delete)
}

export default users