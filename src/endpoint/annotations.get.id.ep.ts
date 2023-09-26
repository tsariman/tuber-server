import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from 'src/business.logic/jsonapi.response.builder'
import { get_annotation_by_id } from 'src/model/annotation'
import { TAnnotationGetFastifyRequest } from 'src/schema/annotations'

export default async function annotations_get_by_id_endpoint (
  request: TAnnotationGetFastifyRequest,
  reply: FastifyReply
) {
  try {
    const annotation = await get_annotation_by_id(request.params.id)
    if (annotation) {
      reply.code(200).send(
        new JsonapiResponseBuilder(annotation, 'annotations', 'object').build()
      )
    } else {
      reply.code(404).send(new JsonapiErrorBuilder()
        .status(404)
        .title('Not Found')
        .detail(`Annotation with id '${request.params.id}' not found.`)
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