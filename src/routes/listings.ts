import { FastifyPluginAsync } from 'fastify'
import get_listing_by_id_endpoint from '../handlers/get.listing.by.id.ep'
import { DEFAULT_ROUTE_OPTIONS } from '../middleware/router.option'
import { IListingsGet } from '../schema/listings'

const listings: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = { ...rootOpts, ...DEFAULT_ROUTE_OPTIONS }

  // GET /listings/:id
  fastify.get<IListingsGet>('/listings/:id', opts, get_listing_by_id_endpoint)
}

export default listings