import { FastifyInstance } from 'fastify'
import post_bookmarks_api_setup_search_index_endpoint from '../endpoint/post.bookmarks.api.search.index.ep'

export default async function prod_install_controller(fastify: FastifyInstance) {
  fastify.post('/setup-collection-index-search/bookmarks',
    {},
    post_bookmarks_api_setup_search_index_endpoint
  )
}