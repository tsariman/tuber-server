import { FastifyInstance } from 'fastify';
import * as C from '@tuber/shared';
import bookmark_controller from './DEV/controller/bookmark.controller';
import user_controller from './DEV/controller/user.controller';

export default async function router_dev(fastify: FastifyInstance) {
  fastify.register(bookmark_controller, { prefix: `/${C.EP_DEV}/${C.EP_BOOKMARKS}` });
  fastify.register(user_controller, { prefix: `/${C.EP_DEV}/${C.EP_USERS}` });
}