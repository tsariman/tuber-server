import { FastifyInstance } from 'fastify'
import { DEFAULT_ROUTE_OPTIONS } from '../middleware/router.option'
import post_state_pages_endpoint from './endpoint/post.state.pages.ep'
import post_state_forms_endpoint from './endpoint/post.state.forms.ep'
import post_state_dialogs_endpoint from './endpoint/post.state.dialogs.ep'

export interface IStatePost {
  Body: {
    key?: string
  }
}

const opts = {
  ...DEFAULT_ROUTE_OPTIONS,
} as typeof DEFAULT_ROUTE_OPTIONS

export default async function state_controller(fastify: FastifyInstance) {
  /**
   * PAGES
   * POST /state/pages
   */
  fastify.post<IStatePost>('/pages', opts, post_state_pages_endpoint)
  fastify.post<IStatePost>('/forms', opts, post_state_forms_endpoint)
  fastify.post<IStatePost>('/dialogs', opts, post_state_dialogs_endpoint)
}