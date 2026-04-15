import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import DEV_STATE_FORM from '../../dev/form'
import { MSG_500_ERROR_MESSAGE, TJsonapiStateResponse } from '@tuber/shared'
import { errr, ler, log_err, task } from '../../utility/logging'

export default async function dev_post_state_forms_endpoint(
  req: FastifyRequest<{ Body: { key?: string }}>,
  reply: FastifyReply
) {
  task('Validating request body ')
  try {
    const key = req.body.key
    if (!key) {
      task.end('[❌]')
      errr(`'key' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_DATA')
        .withTitle('Missing information')
      )
      return
    }
    task.end('[✔️]')
    task(`Loading '${key}' state `)
    const formState = DEV_STATE_FORM[key]
    if (formState) {
      task.end('[✔️]')
      reply.code(200).send({
        'state': {
          'forms': { [key]: formState }
        }
      } as TJsonapiStateResponse)
    } else {
      task.end('[❌]')
      reply.code(404).send({
        ...new JsonapiErrorBuilder()
          .withStatus(404)
          .withCode('NOT_FOUND')
          .withTitle(`Form ${key} Not found`)
          .build(),
        'state': {
          'forms': {
            [key]: { 'items': [] }
          }
        }
      } as TJsonapiStateResponse)
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50027]'))
    log_err('[50027] DEV POST STATE FORMS ERROR', e)
    reply.code(500).send(error_id(50027).default_500_error_response(e))
  }
}