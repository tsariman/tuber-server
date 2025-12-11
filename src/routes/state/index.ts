import { FastifyPluginAsync } from 'fastify'
import { IStatePost } from '../../common.types'
import post_state_pages_endpoint from './post.state.pages.ep'
import post_state_forms_endpoint from './post.state.forms.ep'
import post_state_dialogs_endpoint from './post.state.dialogs.ep'
import { get_bootstrap_key } from '../../business.logic/security'
import post_bootstrap_1_state_endpoint from './post.bootstrap.1.state.ep'
import { PUBLIC_ROUTE_OPTIONS } from '../../middleware/router.option'
import { info } from '../../utility/logging'


const state: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {
  const $public = { ...rootOpts, ...PUBLIC_ROUTE_OPTIONS }
  const randomParam = get_bootstrap_key()
  info('Bootstrap prefix generated:', randomParam)

  // POST /<randomPrefix>
  fastify.post(`/${randomParam}`, $public, post_bootstrap_1_state_endpoint)
  /** POST /state/pages */
  fastify.post<IStatePost>(`/${randomParam}/pages`, $public, post_state_pages_endpoint)
  /** POST /state/forms */
  fastify.post<IStatePost>(`/${randomParam}/forms`, $public, post_state_forms_endpoint)
  /** POST /state/dialogs */
  fastify.post<IStatePost>(`/${randomParam}/dialogs`, $public, post_state_dialogs_endpoint)
}

export default state