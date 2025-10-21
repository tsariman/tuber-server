import { FastifyInstance } from 'fastify';
import get_user_collection_endpoint from '../../endpoint/get.user.collection.ep';
import get_user_by_name_endpoint from '../../endpoint/get.user.by.name.ep';
import post_user_endpoint from '../../endpoint/post.user.ep';
import { IUsersEndpoint } from '../../schema/users';

const opts = {
  // TODO - Add middlewares here when needed.
};

export default async function user_controller(fastify: FastifyInstance) {
  // GET /dev/users
  fastify.get<IUsersEndpoint>('/', opts, get_user_collection_endpoint);
  // GET /dev/users/:name
  fastify.get<IUsersEndpoint>('/:name', opts, get_user_by_name_endpoint);
  // POST /dev/users
  fastify.post<IUsersEndpoint>('/', opts, post_user_endpoint);

  // PUT /users/:id (update)

  // DELETE /users/:id (delete)
}
