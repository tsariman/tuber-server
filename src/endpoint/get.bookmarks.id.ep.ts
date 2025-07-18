import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder, { default_500_error_response } from '../business.logic/builder/jsonapi.error.builder'
import JsonapiResponseBuilder from '../business.logic/builder/jsonapi.response.builder'
import Config from '../config'
import { get_bookmark_by_id } from '../model/bookmark'
import { IBookmarkGet } from '../schema/bookmarks'
import { MSG_500_ERROR_MESSAGE } from '../constants'

export default async function get_bookmarks_by_id_endpoint (
  request: FastifyRequest<IBookmarkGet>,
  reply: FastifyReply
) {
  try {
    Config.print(`[DEBUG] Getting bookmark with id '${request.params.id}'... `)
    const bookmark = await get_bookmark_by_id(request.params.id)
    if (bookmark) {
      Config.log('Done.')
      reply.code(200).send(
        new JsonapiResponseBuilder(bookmark, 'bookmarks', 'object').mPaginationV2build()
      )
    } else {
      Config.log('Failed.\nBookmark not found.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .status(404)
        .title('Not Found')
        .detail(`Bookmark with id '${request.params.id}' not found.`)
        .build()
      )
    }
  } catch (e: any) {
    Config.log(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}