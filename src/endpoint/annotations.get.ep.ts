import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from 'src/business.logic/jsonapi.response.builder'
import Config from 'src/config'
import { exclude_annotation_fields, get_annotation_collection } from 'src/model/annotation'
import { TAnnotationGetFastifyRequest } from 'src/schema/annotations'

export default async function annotations_get_collection_endpoint (
  request: TAnnotationGetFastifyRequest,
  reply: FastifyReply
) {
  try {
    const result = await get_annotation_collection(request)
    const annotationDocs = result.docs
    reply.code(200).send(
      new JsonapiResponseBuilder(annotationDocs, 'annotations', 'collection')
        .setResourceFilter(exclude_annotation_fields)
        .meta('max_loaded_pages', Config.MAX_LOADED_ANNOTATION_PAGES)
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