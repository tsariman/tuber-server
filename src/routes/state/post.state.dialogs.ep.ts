import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import  { STATE_DIALOGS, STATE_DIALOGS_THEME_DARK } from '../../state/dialog'
import { MSG_500_ERROR_MESSAGE, TJsonapiStateResponse } from '@tuber/shared'
import { themed } from '../../business.logic'
import { errr, ler, log_err, task, task_end } from '../../utility/logging'
import { IStatePost } from '../../common.types'

/** `POST /state/dialogs` endpoint handler */
export default async function post_state_dialogs_endpoint (
  req: FastifyRequest<IStatePost>,
  reply: FastifyReply
) {
  try {
    const key = req.body.key
    const mode = req.body.mode
    if (!key) {
      errr(`'key' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_VALUE')
        .withTitle('Missing information')
      )
      return
    }
    if (!mode) {
      errr(`'mode' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_VALUE')
        .withTitle('Missing information')
      )
      return
    }
    task(`Loading '${key}' state... `)
    const light = STATE_DIALOGS[key]
    const dark = STATE_DIALOGS_THEME_DARK[key]
    const dialogState = themed(light, dark, mode)
    if (dialogState) {
      task_end('Done.')
      reply.code(200).send({
        state: {
          'dialogs': { [key]: dialogState },
          'dialogsLight': { [key]: light },
          'dialogsDark': { [key]: dark },
        }
      } as TJsonapiStateResponse)
    } else {
      task_end('Failed.')
      reply.code(404).send({
        state: {
          'dialogs': {
            [key]: {
              '_key': key,
              'title': 'Dialog not found',
              'open': false,
            }
          }
        },
        ...new JsonapiErrorBuilder()
          .withStatus(404)
          .withCode('RESOURCE_NOT_FOUND')
          .withTitle(`Dialog ${key} Not found`)
          .build(),
      } as TJsonapiStateResponse)
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE)
    log_err('POST state dialog', e)
    reply.code(500).send(default_500_error_response(e))
  }
}