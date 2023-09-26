import { FastifyReply } from 'fastify'
import { connect, disconnect } from 'mongoose'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import Config from 'src/config'
import { AnnotationModel } from 'src/model/annotation'
import { TAnnotationGetFastifyRequest } from 'src/schema/annotations'

export default async function annotations_delete_id_endpoint (
  request: TAnnotationGetFastifyRequest,
  reply: FastifyReply
) {
  try {
    await connect(Config.DB_URI)
    const annotation = await AnnotationModel.findByIdAndDelete(request.params.id)
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
