import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import { errr, ler, log_err, task, task_end } from '../../utility/logging'
import { STATE_FORMS, STATE_FORMS_THEME_DARK } from '../form'
import {  MSG_500_ERROR_MESSAGE, TJsonapiStateResponse } from '@tuber/shared'
import { IStatePost } from '../../common.types'
import { themed } from '../../business.logic'

/** `POST /state/forms` endpoint handler */
export default async function post_state_forms_endpoint (
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
    const light = STATE_FORMS[key]
    const dark = STATE_FORMS_THEME_DARK[key]
    const formState = themed(light, dark, mode)
    if (formState) {
      task_end('Done.')
      reply.code(200).send({
        state: {
          'forms': { [key]: formState },
          'formsLight': { [key]: STATE_FORMS[key] },
          'formsDark': { [key]: STATE_FORMS_THEME_DARK[key] },
        }
      } as TJsonapiStateResponse)
    } else {
      task_end('Failed.')
      reply.code(404).send({
        state: {
          'forms': {
            [key]: { 'items': [] }
          }
        },
        ...new JsonapiErrorBuilder()
          .withStatus(404)
          .withCode('RESOURCE_NOT_FOUND')
          .withTitle(`Form ${key} Not found`)
          .build(),
      } as TJsonapiStateResponse)
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE, e)
    log_err('POST state form', e)
    reply.code(500).send(default_500_error_response(e))
  }
}