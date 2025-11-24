import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import DEV_STATE_FORM from '../../dev/form'
import { TNetState, MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { errr, ler, task, task_end } from '../../utility/logging'

export default async function dev_post_state_forms_endpoint(
  req: FastifyRequest<{ Body: { key?: string }}>,
  reply: FastifyReply
) {
  try {
    const key = req.body.key
    if (!key) {
      errr(`'key' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_VALUE')
        .withTitle('Missing information')
      )
      return
    }
    task(`Loading '${key}' state... `)
    const formState = DEV_STATE_FORM[key]
    if (formState) {
      task_end('Done.')
      reply.code(200).send({
        'state': {
          'forms': { [key]: formState }
        } as TNetState
      })
    } else {
      task_end('Failed.')
      reply.code(404).send({
        ...new JsonapiErrorBuilder()
          .withStatus(404)
          .withCode('RESOURCE_NOT_FOUND')
          .withTitle(`Form ${key} Not found`)
          .build(),
        state: {
          'forms': {
            [key]: { 'items': [] }
          }
        } as TNetState
      })
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}