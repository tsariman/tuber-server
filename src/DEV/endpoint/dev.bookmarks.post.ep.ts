import { FastifyReply } from 'fastify'
import {
  generic_500_error_response
} from '../../business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from '../../business.logic/jsonapi.response.builder'
import Config from '../../config'
import { create_bookmark } from '../../model/bookmark'
import { TBookmarkPostFastifyRequest } from '../../schema/bookmarks'
import { gen_random_bookmark_votes } from '..'
import fix_missing_bookmark_data from 'src/business.logic/platform.drivers'

export default async function dev_bookmarks_post_endpoint (
  req: TBookmarkPostFastifyRequest,
  reply: FastifyReply
) {
  try {
    Config.print('Creating bookmark... ')
    const attr = req.body.data.attributes

    // Generate random votes for development purposes
    const attrWithVotes = gen_random_bookmark_votes(attr)
    const bookmark = await fix_missing_bookmark_data(attrWithVotes)
    if (!bookmark) {
      reply.code(500).send(generic_500_error_response({
        message: 'Failed to create bookmark.',
        stack: 'Bookmark is undefined.'
      }))
      return
    }
    const dbBookmark = await create_bookmark(bookmark)
    Config.log('done.')
    reply.code(201).send(
      new JsonapiResponseBuilder(dbBookmark, 'bookmarks', 'object')
      .mPaginationV2build()
    )
  } catch (e: any) {
    Config.log('failed.\nInternal Server Error.', e)
    reply.code(500).send(generic_500_error_response(e))
  }
}