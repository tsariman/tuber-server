import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from '../business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from '../business.logic/jsonapi.response.builder'
import Config from '../config'
import { create_annotation } from '../model/annotation'
import { TAnnotationPostFastifyRequest } from '../schema/annotations'

export default async function annotations_post_endpoint (
  request: TAnnotationPostFastifyRequest,
  reply: FastifyReply
) {
  try {
    Config.print('Creating annotation... ')
    const annotation = request.body.data.attributes
    // const fixedAnnotation = await fix_missing_annotation_data(annotation)
    // if (!fixedAnnotation?.videoid) {
    //   throw new Error('Unable to acquire video ID from Rumble URL.')
    // }
    // const dbAnnotation = await create_annotation(fixedAnnotation)
    const dbAnnotation = await create_annotation(annotation)
    Config.log('done.')
    reply.code(201).send(
      new JsonapiResponseBuilder(dbAnnotation, 'annotations', 'object')
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