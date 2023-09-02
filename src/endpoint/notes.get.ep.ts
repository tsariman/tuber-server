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
    const result = await get_note_collection()
    const noteDocs = result.docs
    reply.code(200).send(
      new JsonapiResponseBuilder(noteDocs, 'notes', 'collection')
        .buildLinks(result)
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