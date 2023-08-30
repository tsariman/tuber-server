import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from 'src/business.logic/jsonapi.response.builder'
import { get_note_collection } from 'src/model/note'
import { TNotesFastifyRequest } from 'src/schema/notes'

export default async function notes_get_collection_endpoint (
  _request: TNotesFastifyRequest,
  reply: FastifyReply
) {
  try {
    const noteCollection = await get_note_collection()
    reply.code(200).send(
      new JsonapiResponseBuilder(noteCollection, 'notes', 'collection')
      .build()
    )
  } catch (e: any) {
    reply.code(500).send(new JsonapiErrorBuilder()
      .status(500)
      .title('Internal Server Error')
      .detail(e.message)
      .build()
    )
  }
}