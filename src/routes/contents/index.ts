import { FastifyPluginAsync } from 'fastify'
import { PUBLIC_ROUTE_OPTIONS } from '../../middleware/router.option'
import get_content_by_name_endpoint from './get.content.by.name.ep'

const contents: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {
  const $public = { ...rootOpts, ...PUBLIC_ROUTE_OPTIONS }

  /** GET /contents/:name */
  fastify.get<{ Params: { name: string } }>(`/:name`, $public, get_content_by_name_endpoint)
}

export default contents
