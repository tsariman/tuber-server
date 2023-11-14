import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder, {
  generic_500_error_response
} from '../business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from '../business.logic/jsonapi.response.builder'
import Config from '../config'
import { create_bookmark } from '../model/bookmark'
import { TBookmarkPostFastifyRequest } from '../schema/bookmarks'
import fix_missing_bookmark_data from 'src/business.logic/platform.drivers'

export default async function bookmarks_post_endpoint (
  req: TBookmarkPostFastifyRequest,
  reply: FastifyReply
) {
  try {
    Config.print('Creating bookmark... ')
    const attributes = req.body.data.attributes
    const bookmark = await fix_missing_bookmark_data(attributes)
    if (!bookmark) {
      reply.code(400).send(generic_500_error_response({
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
    reply.code(500).send(new JsonapiErrorBuilder()
      .status(500)
      .code('internal_server_error')
      .title(e.message)
      .detail(e.stack)
      .build()
    )
  }
}