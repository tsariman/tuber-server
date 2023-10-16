import { FastifyInstance } from 'fastify'
import annotations_get_collection_endpoint from '../endpoint/annotations.get.ep'
import annotations_get_by_id_endpoint from '../endpoint/annotations.get.id.ep'
import annotations_post_endpoint from '../endpoint/annotations.post.ep'
import annotations_put_by_id_endpoint from '../endpoint/annotations.put.id.ep'
import annotations_delete_by_id_endpoint from '../endpoint/annotations.delete.id.ep'
import { DEFAULT_OPTIONS } from '../middleware/router.option'
import {
  IAnnotationGet,
  IAnnotationPost,
  IAnnotationPut,
  IAnnotationDelete
} from '../schema/annotations'

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
  fastify.delete<IAnnotationDelete>('/:id', opts, annotations_delete_by_id_endpoint)
}