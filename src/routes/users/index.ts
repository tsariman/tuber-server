import { FastifyPluginAsync } from 'fastify'
import get_user_collection_endpoint from './get.user.collection.ep'
import get_user_by_name_endpoint from './get.user.by.name.ep'
import post_user_endpoint from './post.user.ep'
import post_user_verify_email_endpoint from './post.user.verify.email.ep'
import {
  DEFAULT_ROUTE_OPTIONS,
  PUBLIC_ROUTE_OPTIONS
} from '../../middleware/router.option'
import { IUsersEndpoint, IUsersVoteEndpoint } from '../../schema/user'
import { put_user_vote_by_id_endpoint } from './put.user.by.id.ep'

const users: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = {
    ...rootOpts,
    ...DEFAULT_ROUTE_OPTIONS,
  }

  // GET /users
  fastify.get<IUsersEndpoint>('/', opts, get_user_collection_endpoint)

  // GET /users/email/verify
  fastify.get<IUsersEndpoint>('/email/verify', {
    ...rootOpts,
    ...PUBLIC_ROUTE_OPTIONS
  }, post_user_verify_email_endpoint)

  // GET /users/:name
  fastify.get<IUsersEndpoint>('/:name', opts, get_user_by_name_endpoint)

  // POST /users
  fastify.post<IUsersEndpoint>('/', {
    ...rootOpts,
    ...PUBLIC_ROUTE_OPTIONS
  }, post_user_endpoint)

  // POST /users/email/verify
  fastify.post<IUsersEndpoint>('/email/verify', {
    ...rootOpts,
    ...PUBLIC_ROUTE_OPTIONS
  }, post_user_verify_email_endpoint)

  // PUT /users/:id (update)
  // PUT /users/:userId/vote (upvote/downvote)
  fastify.put<IUsersVoteEndpoint>('/:userId/vote', opts, put_user_vote_by_id_endpoint)

  // DELETE /users/:id (delete)
}

export default users