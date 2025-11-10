import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import post_bookmarks_api_setup_search_index_endpoint from '../handlers/post.bookmark.api.search.index.ep'
import Config from '../config'

const install: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  if (Config.DEV) {
    const opts = { ...rootOpts }
    fastify.post('/install/setup-collection-index-search/bookmarks',
      opts,
      post_bookmarks_api_setup_search_index_endpoint
    )
    fastify.post('/install/readable', {}, (req: FastifyRequest, reply: FastifyReply) => {
      void req;
      void reply;
      return { status: 'ok' }
    })
  }

}

export default install
