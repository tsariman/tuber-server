import { FastifyInstance } from 'fastify';
import get_users_collection_endpoint from '../endpoint/get.user.ep';
import get_user_by_name_endpoint from '../endpoint/get.user.name.ep';
import post_user_endpoint from '../endpoint/post.user.ep';
import { DEFAULT_ROUTE_OPTIONS } from '../middleware/router.option';
import { IUsersEndpoint } from '../schema/users';
import Config from '../config';
import post_demo_users_endpoint from 'src/endpoint/post.user.demo.ep';
import get_user_collection_demo_endpoint from 'src/endpoint/get.user.collection.demo.ep';

const opts = {
  ...DEFAULT_ROUTE_OPTIONS,
};

const getUsersEndpointSwitch = Config.DEMO
  ? get_user_collection_demo_endpoint
  : get_users_collection_endpoint;

const postUsersEnpointSwitch = Config.DEMO
  ? post_demo_users_endpoint
  : post_user_endpoint;

export default async function user_controller(fastify: FastifyInstance) {
  // GET /users
  fastify.get<IUsersEndpoint>('/', opts, getUsersEndpointSwitch);
  // GET /users/:name
  fastify.get<IUsersEndpoint>('/:name', opts, get_user_by_name_endpoint);
  // POST /users
  fastify.post<IUsersEndpoint>('/', opts, postUsersEnpointSwitch);

  // PUT /users/:id (update)

  // DELETE /users/:id (delete)
}
