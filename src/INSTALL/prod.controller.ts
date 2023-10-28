import { FastifyInstance } from 'fastify'
import bookmarks_api_setup_search_index_endpoint from '../endpoint/bookmarks.api.search.index.ep'

export default async function prod_install_controller(fastify: FastifyInstance) {
  fastify.post('/setup-collection-index-search/bookmarks',
    {},
    bookmarks_api_setup_search_index_endpoint
  )
}