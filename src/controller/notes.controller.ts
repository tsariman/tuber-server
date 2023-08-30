import { FastifyInstance } from 'fastify'
import notes_get_collection_endpoint from 'src/endpoint/notes.get.ep'
import notes_get_by_id_endpoint from 'src/endpoint/notes.get.id.ep'
import notes_post_endpoint from 'src/endpoint/notes.post.ep'
import { DEFAULT_OPTIONS } from 'src/middleware/router.option'
import { INotesEndpoint } from 'src/schema/notes'

const opts = {
  ...DEFAULT_OPTIONS,
}

export default async function notes_controller(fastify: FastifyInstance) {
  // GET /notes
  fastify.get<INotesEndpoint>('/', opts, notes_get_collection_endpoint)

  // GET /notes/:id
  fastify.get<INotesEndpoint>('/:id', opts, notes_get_by_id_endpoint)

  // POST /notes
  fastify.post<INotesEndpoint>('/', opts, notes_post_endpoint)

  // PUT /notes/:id (update)

  // DELETE /notes/:id (delete)
}