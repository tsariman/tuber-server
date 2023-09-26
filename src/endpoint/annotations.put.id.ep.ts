import { FastifyReply } from 'fastify'
import { connect, disconnect } from 'mongoose'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import Config from 'src/config'
import { AnnotationModel } from 'src/model/annotation'
import { TAnnotationPutFastifyRequest } from 'src/schema/annotations'

export default async function annotations_put_id_endpoint (
  request: TAnnotationPutFastifyRequest,
  reply: FastifyReply
) {
  try {
    // [TODO] Validate request body (request.body.data.attributes)
    //        video_id, platform, start_seconds, title are required
    const attributes = request.body.data.attributes
    if (!attributes) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .status(400)
        .title('Bad Request')
        .detail('Missing attributes')
        .build()
      )
      return
    }
    await connect(Config.DB_URI)
    const annotation = await AnnotationModel.findByIdAndUpdate(
      request.params.id,
      request.body.data.attributes,
      { new: true }
    )
    await disconnect()
    if (annotation) {
      reply.code(204).send()
    } else {
      reply.code(404).send(new JsonapiErrorBuilder()
        .status(404)
        .title('Not Found')
        .detail('Annotation not found')
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