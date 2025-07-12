import { FastifyInstance } from 'fastify';
import get_users_collection_endpoint from '../endpoint/get.users.ep';
import get_users_by_name_endpoint from '../endpoint/get.users.name.ep';
import post_users_endpoint from '../endpoint/post.users.ep';
import { DEFAULT_ROUTE_OPTIONS } from '../middleware/router.option';
import { IUsersEndpoint } from '../schema/users';
import Config from '../config';
import post_demo_users_endpoint from 'src/endpoint/post.demo.users.ep';
import demo_users_get_collection_endpoint from 'src/endpoint/get.demo.users.ep';

const opts = {
  ...DEFAULT_ROUTE_OPTIONS,
};

const getUsersEndpointSwitch = Config.DEMO
  ? demo_users_get_collection_endpoint
  : get_users_collection_endpoint;

const postUsersEnpointSwitch = Config.DEMO
  ? post_demo_users_endpoint
  : post_users_endpoint;

export default async function users_controller(fastify: FastifyInstance) {
  // GET /users
  fastify.get<IUsersEndpoint>('/', opts, getUsersEndpointSwitch);
  // GET /users/:name
  fastify.get<IUsersEndpoint>('/:name', opts, get_users_by_name_endpoint);
  // POST /users
  fastify.post<IUsersEndpoint>('/', opts, postUsersEnpointSwitch);

  // PUT /users/:id (update)

  // DELETE /users/:id (delete)
}
