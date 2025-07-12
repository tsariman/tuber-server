import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import post_bookmarks_api_setup_search_index_endpoint from '../endpoint/post.bookmarks.api.search.index.ep';

export default async function prod_install_controller(fastify: FastifyInstance) {
  fastify.post('/setup-collection-index-search/bookmarks',
    {},
    post_bookmarks_api_setup_search_index_endpoint
  );
}

export async function prod_install_db_readable(fastify: FastifyInstance) {
  fastify.post('/readable', {}, (
    _req: FastifyRequest,
    _reply: FastifyReply
  ) => {
    
    return { status: 'ok' };
  });
}
