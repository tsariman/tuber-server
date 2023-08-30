import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from 'src/business.logic/jsonapi.response.builder'
import { create_note } from 'src/model/note'
import { TNotesFastifyRequest } from 'src/schema/notes'

export default async function notes_post_endpoint (
  request: TNotesFastifyRequest,
  reply: FastifyReply
) {
  try {
    const note = await create_note(request.body)
    reply.code(201).send(
      new JsonapiResponseBuilder(note, 'notes', 'object').build()
    )
  } catch (e: any) {
    const errors = new JsonapiErrorBuilder()
    reply.code(500).send(errors.status(500)
      .title('Internal Server Error')
      .detail(e.message)
      .build()
    )
  }
}