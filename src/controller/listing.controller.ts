import { FastifyInstance } from 'fastify';
import get_listing_by_id_endpoint from '../endpoint/get.listing.by.id.ep';
import { DEFAULT_ROUTE_OPTIONS } from '../middleware/router.option';
import { IListingsGet } from '../schema/listings';

/** Default options */
const opts = { ...DEFAULT_ROUTE_OPTIONS };

export default async function listing_controller(fastify: FastifyInstance) {
  // GET /listings/:id
  fastify.get<IListingsGet>('/:id', opts, get_listing_by_id_endpoint);
}