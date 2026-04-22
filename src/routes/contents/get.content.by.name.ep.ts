import { FastifyReply, FastifyRequest } from 'fastify'
import { dbug, log_err, task, ler } from '../../utility/logging'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { content_get_by_name } from '../../model/content'
import { EP_CONTENTS, MSG_500_ERROR_MESSAGE } from '@tuber/shared'

/** `GET /contents/:name` endpoint handler */
export default async function get_content_by_name_endpoint(
  req: FastifyRequest<{ Params: { name?: string } }>,
  reply: FastifyReply
) {
  const { name } = req.params
  try {
    dbug(`Received request to load content for name '${name}'.`)
    task('Validating request params ')
    if (!name) {
      task.end('[❌]')
      dbug('[400] Missing content name param.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MALFORMED_REQUEST')
        .withTitle('Malformed request received.')
        .withDetail('The \'name\' URL parameter is required.')
        .build())
      return
    }
    task.end('[✔️]')
    task(`Loading content '${name}' `)

    const doc = await content_get_by_name(name)

    if (!doc) {
      task.end('[❌]')
      dbug(`[404] Content '${name}' not found.`)
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Content not found.')
        .withDetail(`No content found for name '${name}'.`)
        .build())
      return
    }

    task.end('[✔️]')
    reply.code(200).send({
      data: {
        type: EP_CONTENTS,
        id: doc.name,
        attributes: {
          name: doc.name,
          html: doc.html,
        },
      },
    })
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50056]'))
    log_err('[50056] GET content by name', e)
    reply.code(500).send(error_id(50056).default_500_error_response(e))
  }
}
