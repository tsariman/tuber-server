import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from 'src/business.logic/jsonapi.response.builder'
import { create_annotation } from 'src/model/annotation'
import { TAnnotationPostFastifyRequest } from 'src/schema/annotations'

export default async function annotations_post_endpoint (
  request: TAnnotationPostFastifyRequest,
  reply: FastifyReply
) {
  try {
    const annotation = await create_annotation(request.body.data.attributes)
    reply.code(201).send(
      new JsonapiResponseBuilder(annotation, 'annotations', 'object')
      .build()
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