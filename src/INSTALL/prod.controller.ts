import { FastifyInstance } from 'fastify'
import annotations_api_setup_search_index_endpoint from 'src/endpoint/annotations.api.search.index.ep'

export default async function prod_install_controller(fastify: FastifyInstance) {
  fastify.post('/setup-collection-index-search/annotations',
    {},
    annotations_api_setup_search_index_endpoint
  )
}