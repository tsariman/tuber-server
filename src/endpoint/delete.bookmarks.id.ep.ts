import { FastifyReply } from 'fastify'
// import { connect, disconnect } from 'mongoose'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../business.logic/jsonapi.error.builder'
import Config from '../config'
import { BookmarkModel } from '../model/bookmark'
import { TBookmarkDeleteFastifyRequest } from '../schema/bookmarks'
import { MSG_500_ERROR_MESSAGE } from '../constants'

export default async function delete_bookmarks_by_id_endpoint (
  request: TBookmarkDeleteFastifyRequest,
  reply: FastifyReply
) {
  try {
    Config.print('Disabling bookmark... ')
    // await connect(Config.DB_URI)
    const bookmark = await BookmarkModel.findByIdAndUpdate(
      request.params.id,
      { is_active: false },
      { new: true }
    )
    // await disconnect()
    if (bookmark) {
      Config.log('Done.')
      reply.code(204).send()
    } else {
      Config.log('Failed.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .status(404)
        .code('not_found')
        .title('Not Found')
        .detail(`Bookmark with id ${request.params.id} not found`)
        .build()
      )
    }
  } catch (e: any) {
    Config.log(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}
