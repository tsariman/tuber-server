import { FastifyInstance } from 'fastify'
import annotations_get_collection_endpoint from 'src/endpoint/annotations.get.ep'
import annotations_get_by_id_endpoint from 'src/endpoint/annotations.get.id.ep'
import annotations_post_endpoint from 'src/endpoint/annotations.post.ep'
import annotations_put_by_id_endpoint from 'src/endpoint/annotations.put.id.ep'
import { DEFAULT_OPTIONS } from 'src/middleware/router.option'
import { IAnnotationGet, IAnnotationPost, IAnnotationPut } from 'src/schema/annotations'

const opts = {
  ...DEFAULT_OPTIONS,
}

export default async function notes_controller(fastify: FastifyInstance) {
  // GET /notes
  fastify.get<IAnnotationGet>('/', opts, annotations_get_collection_endpoint)

  // GET /notes/:id
  fastify.get<IAnnotationGet>('/:id', opts, annotations_get_by_id_endpoint)

  // POST /notes
  fastify.post<IAnnotationPost>('/', opts, annotations_post_endpoint)

  // PUT /notes/:id (update)
  fastify.put<IAnnotationPut>('/:id', opts, annotations_put_by_id_endpoint)

  // DELETE /notes/:id (delete)
}