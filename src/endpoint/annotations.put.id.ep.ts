import { FastifyReply } from 'fastify'
// import { connect, disconnect } from 'mongoose'
import JsonapiErrorBuilder from '../business.logic/jsonapi.error.builder'
import Config from '../config'
import { AnnotationModel } from '../model/annotation'
import { TAnnotationPutFastifyRequest } from '../schema/annotations'

export default async function annotations_put_by_id_endpoint (
  request: TAnnotationPutFastifyRequest,
  reply: FastifyReply
) {
  try {
    Config.print('Updating annotation... ')
    // [TODO] Validate request body (request.body.data.attributes)
    //        video_id, platform, start_seconds, title are required
    const attributes = request.body?.data?.attributes
    if (!attributes) {
      Config.log('failed.\nMissing attributes.', request.body)
      reply.code(400).send(new JsonapiErrorBuilder()
        .status(400)
        .title('Bad Request')
        .detail('Missing attributes')
        .build()
      )
      return
    }
    // await connect(Config.DB_URI)
    const annotation = await AnnotationModel.findByIdAndUpdate(
      request.params.id,
      { ...attributes, modified_at: new Date() },
      { new: true }
    )
    // await disconnect()
    if (annotation) {
      Config.log('done.')
      reply.code(204).send()
    } else {
      Config.log('failed.\nAnnotation not found.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .status(404)
        .title('Not Found')
        .detail('Annotation not found')
        .build()
      )
    }
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
