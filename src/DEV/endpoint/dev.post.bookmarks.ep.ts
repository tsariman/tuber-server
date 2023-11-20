import { FastifyReply } from 'fastify'
import {
  default_500_error_response
} from '../../business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from '../../business.logic/jsonapi.response.builder'
import Config from '../../config'
import { create_bookmark } from '../../model/bookmark'
import { TBookmarkPostFastifyRequest } from '../../schema/bookmarks'
import { gen_random_bookmark_votes } from '..'
import fix_missing_bookmark_data from 'src/platform/all.drivers'
import { DEFAULT_500_ERROR_MESSAGE } from '../../constants'

export default async function dev_post_bookmarks_endpoint (
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
      Config.log('Failed.')
      reply.code(500).send(default_500_error_response({
        title: 'Failed to create bookmark.',
        detail: 'Bookmark is null.'
      }))
      return
    }
    const dbBookmark = await create_bookmark(bookmark)
    Config.log('Done.')
    reply.code(201).send(
      new JsonapiResponseBuilder(dbBookmark, 'bookmarks', 'object')
      .mPaginationV2build()
    )
  } catch (e: any) {
    Config.log(DEFAULT_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}