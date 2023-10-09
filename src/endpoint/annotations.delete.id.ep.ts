import { FastifyReply } from 'fastify'
// import { connect, disconnect } from 'mongoose'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import Config from 'src/config'
import { AnnotationModel } from 'src/model/annotation'
import { TAnnotationDeleteFastifyRequest } from 'src/schema/annotations'

export default async function annotations_delete_by_id_endpoint (
  request: TAnnotationDeleteFastifyRequest,
  reply: FastifyReply
) {
  try {
    Config.print('Disabling annotation... ')
    // await connect(Config.DB_URI)
    const annotation = await AnnotationModel.findByIdAndUpdate(
      request.params.id,
      { is_active: false },
      { new: true }
    )
    // await disconnect()
    if (annotation) {
      Config.log('done.')
      reply.code(204).send()
    } else {
      Config.log('failed.')
      reply.code(404).send(new JsonapiErrorBuilder()
        .status(404)
        .code('not_found')
        .title('Not Found')
        .detail(`Annotation with id ${request.params.id} not found`)
        .build()
      )
    }
  } catch (e: any) {
    Config.log('failed.')
    Config.log(e)
    reply.code(500).send(new JsonapiErrorBuilder()
      .status(500)
      .code('internal_server_error')
      .title(e.message)
      .detail(e.stack)
      .build()
    )
  }
}
