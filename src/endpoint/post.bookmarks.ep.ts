import { FastifyReply } from 'fastify'
import {
  default_500_error_response,
  default_400_error_response
} from '../business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from '../business.logic/jsonapi.response.builder'
import Config from '../config'
import { create_bookmark } from '../model/bookmark'
import { TBookmarkPostFastifyRequest } from '../schema/bookmarks'
import fix_missing_bookmark_data from '../platform/all.drivers'
import { MSG_500_ERROR_MESSAGE } from '../constants'

export default async function post_bookmarks_endpoint (
  req: TBookmarkPostFastifyRequest,
  reply: FastifyReply
) {
  try {
    Config.print('Creating bookmark... ')
    const attributes = req.body.data.attributes
    const bookmark = await fix_missing_bookmark_data(attributes)
    if (!bookmark) {
      Config.log('Failed.')
      reply.code(400).send(default_400_error_response({
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
    Config.log(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}