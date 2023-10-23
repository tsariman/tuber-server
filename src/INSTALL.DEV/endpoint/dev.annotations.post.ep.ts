import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from '../../business.logic/jsonapi.response.builder'
import Config from '../../config'
import { create_annotation } from '../../model/annotation'
import { TAnnotationPostFastifyRequest } from '../../schema/annotations'
import { gen_random_annotation_votes } from '..'

export default async function dev_annotations_post_endpoint (
  req: TAnnotationPostFastifyRequest,
  reply: FastifyReply
) {
  try {
    Config.print('Creating annotation... ')
    const reqAttr = req.body.data.attributes

    // Generate random votes for development purposes
    const annotation = gen_random_annotation_votes(reqAttr)

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