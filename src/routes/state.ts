import { FastifyPluginAsync } from 'fastify'
import { IStatePost } from '../common.types'
import post_state_pages_endpoint from '../state/handlers/post.state.pages.ep'
import post_state_forms_endpoint from '../state/handlers/post.state.forms.ep'
import post_state_dialogs_endpoint from '../state/handlers/post.state.dialogs.ep'
import { get_bootstrap_key } from '../business.logic/security'
import post_bootstrap_1_state_endpoint from '../state/handlers/post.bootstrap.1.state.ep'
import { OPTIONAL_ROUTE_OPTIONS } from '../middleware/router.option'

const state: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = { ...rootOpts, ...OPTIONAL_ROUTE_OPTIONS }

  const randomPrefix = get_bootstrap_key()
  
  // Log the bootstrap prefix for debugging (remove in production)
  console.log('[INFO] Bootstrap prefix generated:', randomPrefix)

  // POST /<randomPrefix>
  fastify.post(`/${randomPrefix}`, opts, post_bootstrap_1_state_endpoint)

  /** POST /state/pages */
  fastify.post<IStatePost>('/state/pages', opts, post_state_pages_endpoint)
  /** POST /state/forms */
  fastify.post<IStatePost>('/state/forms', opts, post_state_forms_endpoint)
  /** POST /state/dialogs */
  fastify.post<IStatePost>('/state/dialogs', opts, post_state_dialogs_endpoint)
}

export default state