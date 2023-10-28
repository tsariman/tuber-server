import { FastifyReply } from 'fastify'
// import { connect, disconnect } from 'mongoose'
import JsonapiErrorBuilder from '../business.logic/jsonapi.error.builder'
import Config from '../config'
import { BookmarkModel } from '../model/bookmark'
import { TBookmarkDeleteFastifyRequest } from '../schema/bookmarks'

export default async function bookmarks_delete_by_id_endpoint (
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
      Config.log('done.')
      reply.code(204).send()
    } else {
      Config.log('failed.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .status(404)
        .code('not_found')
        .title('Not Found')
        .detail(`Bookmark with id ${request.params.id} not found`)
        .build()
      )
    }
  } catch (e: any) {
    Config.log('failed.')
    Config.log(e)
    reply.code(500).send(new JsonapiErrorBuilder()
      .status(500)
      .code('internal_server_error')
      .title(e.message)
      .detail(e.stack)
      .build()
    )
  }
}
