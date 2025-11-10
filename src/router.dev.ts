import { FastifyInstance } from 'fastify'
import * as C from '@tuber/shared/dist/constants.server'
import bookmark_controller from './routes/dev/bookmarks'
import user_controller from './routes/dev/user'

export default async function router_dev(fastify: FastifyInstance) {
  fastify.register(bookmark_controller, { prefix: `/${C.EP_DEV}/${C.EP_BOOKMARKS}` })
  fastify.register(user_controller, { prefix: `/${C.EP_DEV}/${C.EP_USERS}` })
}