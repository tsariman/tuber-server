import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import post_bookmarks_api_setup_search_index_endpoint from './bookmarks/post.bookmark.api.search.index.ep'

const install: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {
  const opts = { ...rootOpts }

  fastify.post('/install/setup-collection-index-search/bookmarks',
    opts,
    post_bookmarks_api_setup_search_index_endpoint
  )

  fastify.post('/install/readable', {}, (req: FastifyRequest, reply: FastifyReply) => {
    void req
    void reply
    return { status: 'ok' }
  })
}

export default install
