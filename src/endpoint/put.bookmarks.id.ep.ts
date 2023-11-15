import { FastifyReply } from 'fastify'
// import { connect, disconnect } from 'mongoose'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../business.logic/jsonapi.error.builder'
import Config from '../config'
import { BookmarkModel } from '../model/bookmark'
import { TBookmarkPutFastifyRequest } from '../schema/bookmarks'
import { DEFAULT_500_ERROR_MESSAGE } from '../constants'

export default async function put_bookmarks_by_id_endpoint (
  request: TBookmarkPutFastifyRequest,
  reply: FastifyReply
) {
  try {
    Config.print('Updating bookmark... ')
    // [TODO] Validate request body (request.body.data.attributes)
    //        video_id, platform, start_seconds, title are required
    const attributes = request.body?.data?.attributes
    if (!attributes) {
      Config.log('failed.\nMissing attributes.', request.body)
      reply.code(400).send(new JsonapiErrorBuilder()
        .status(400)
        .title('Bad Request')
        .detail('Missing attributes')
        .build()
      )
      return
    }
    // await connect(Config.DB_URI)
    const bookmark = await BookmarkModel.findByIdAndUpdate(
      request.params.id,
      { ...attributes, modified_at: new Date() },
      { new: true }
    )
    // await disconnect()
    if (bookmark) {
      Config.log('done.')
      reply.code(204).send()
    } else {
      Config.log('failed.\nBookmark not found.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .status(404)
        .title('Not Found')
        .detail('Bookmark not found')
        .build()
      )
    }
  } catch (e: any) {
    Config.log(DEFAULT_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}
