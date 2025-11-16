import { FastifyInstance } from 'fastify'
import { DEFAULT_ROUTE_OPTIONS } from '../middleware/router.option'
import post_state_pages_endpoint from './handlers/post.state.pages.ep'
import post_state_forms_endpoint from './handlers/post.state.forms.ep'
import post_state_dialogs_endpoint from './handlers/post.state.dialogs.ep'
import { IStatePost } from '../common.types'

const opts = {
  ...DEFAULT_ROUTE_OPTIONS,
} as typeof DEFAULT_ROUTE_OPTIONS

/** @deprecated */
export default async function state_controller(fastify: FastifyInstance) {
  /**
   * PAGES
   * POST /state/pages
   */
  fastify.post<IStatePost>('/pages', opts, post_state_pages_endpoint)
  fastify.post<IStatePost>('/forms', opts, post_state_forms_endpoint)
  fastify.post<IStatePost>('/dialogs', opts, post_state_dialogs_endpoint)
}