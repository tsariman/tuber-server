import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from 'src/business.logic/jsonapi.response.builder'
import { get_note_by_id } from 'src/model/note'
import { TNotesFastifyRequest } from 'src/schema/notes'

export default async function notes_get_by_id_endpoint (
  request: TNotesFastifyRequest,
  reply: FastifyReply
) {
  try {
    const note = await get_note_by_id(request.params.id)
    if (note) {
      reply.code(200).send(
        new JsonapiResponseBuilder(note, 'notes', 'object').build()
      )
    } else {
      reply.code(404).send(new JsonapiErrorBuilder()
        .status(404)
        .title('Not Found')
        .detail(`Note with id '${request.params.id}' not found.`)
        .build()
      )
    }
  } catch (e: any) {
    reply.code(500).send(new JsonapiErrorBuilder()
      .status(500)
      .title('Internal Server Error')
      .detail(e.message)
      .build()
    )
  }
}