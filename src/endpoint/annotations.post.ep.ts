import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from 'src/business.logic/jsonapi.response.builder'
import Config from 'src/config'
import { create_annotation } from 'src/model/annotation'
import { TAnnotationPostFastifyRequest } from 'src/schema/annotations'

export default async function annotations_post_endpoint (
  request: TAnnotationPostFastifyRequest,
  reply: FastifyReply
) {
  try {
    Config.print('Creating annotation... ')
    const annotation = await create_annotation(request.body.data.attributes)
    Config.log('done.')
    reply.code(201).send(
      new JsonapiResponseBuilder(annotation, 'annotations', 'object')
      .mPaginationV2build()
    )
  } catch (e: any) {
    Config.log('failed.\nInternal Server Error.', e)
    reply.code(500).send(new JsonapiErrorBuilder()
      .status(500)
      .code('internal_server_error')
      .title(e.message)
      .detail(e.stack)
      .build()
    )
  }
}