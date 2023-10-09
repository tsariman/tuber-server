import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from 'src/business.logic/jsonapi.response.builder'
import Config from 'src/config'
import { get_annotation_by_id } from 'src/model/annotation'
import { TAnnotationGetFastifyRequest } from 'src/schema/annotations'

export default async function annotations_get_by_id_endpoint (
  request: TAnnotationGetFastifyRequest,
  reply: FastifyReply
) {
  try {
    Config.print(`Getting annotation with id '${request.params.id}'... `)
    const annotation = await get_annotation_by_id(request.params.id)
    if (annotation) {
      Config.log('done.')
      reply.code(200).send(
        new JsonapiResponseBuilder(annotation, 'annotations', 'object').mPaginationV2build()
      )
    } else {
      Config.log('failed.\nAnnotation not found.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .status(404)
        .title('Not Found')
        .detail(`Annotation with id '${request.params.id}' not found.`)
        .build()
      )
    }
  } catch (e: any) {
    Config.log('failed.\nInternal Server Error.', e)
    reply.code(500).send(new JsonapiErrorBuilder()
      .status(500)
      .title('Internal Server Error')
      .detail(e.message)
      .build()
    )
  }
}