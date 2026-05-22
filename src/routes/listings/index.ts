import { FastifyPluginAsync } from 'fastify'
import get_listing_by_id_endpoint from './get.listing.by.id.ep'
import post_listing_endpoint from './post.listing.ep'
import { DEFAULT_ROUTE_OPTIONS } from '../../middleware/router.option'
import { IListingsGet, IListingPost } from '../../schema/listing'

const listings: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = { ...rootOpts, ...DEFAULT_ROUTE_OPTIONS }

  // GET /listings/:id
  fastify.get<IListingsGet>('/:id', opts, get_listing_by_id_endpoint)

  // POST /listings
  fastify.post<IListingPost>('/', opts, post_listing_endpoint)
}

export default listings