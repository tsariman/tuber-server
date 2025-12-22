import { FastifyReply, FastifyRequest } from 'fastify'
import { log_err, task, task_end } from '../../utility/logging'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import  { STATE_PAGES, STATE_PAGES_THEME_DARK } from '../../state/page'
import { MSG_500_ERROR_MESSAGE, type TJsonapiStateResponse } from '@tuber/shared'
import type { IStatePost } from '../../common.types'
import { themed } from '../../business.logic'

/** `POST /state/pages` endpoint handler */
export default async function post_state_pages_endpoint (
  req: FastifyRequest<IStatePost>,
  reply: FastifyReply
) {
  try {
    task('Validating request body... ')
    if (!req.body.key || !req.body.mode) {
      task_end('Failed', '❌', '\n[DEBUG][400] Malformed request received.', req.body)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MALFORMED_REQUEST')
        .withTitle('Malformed request received.')
        .withDetail('Both \'key\' and \'mode\' are required in the request body.')
        .build())
      return
    }
    const { key, mode } = req.body

    task(`Loading '${key}' state... `)
    const light = STATE_PAGES[key]
    const dark = STATE_PAGES_THEME_DARK[key]
    const pageState = themed(light, dark, mode)
    if (pageState) {
      task_end('OK', '✔️')
      reply.code(200).send({
        state: {
          'pages': { [key]: pageState },
          'pagesLight': { [key]: STATE_PAGES[key] },
          'pagesDark': { [key]: STATE_PAGES_THEME_DARK[key] },
        }
      } as TJsonapiStateResponse)
    } else {
      task_end('Failed.', '❌', `\n[DEBUG][404] Page state for key '${key}' not found.`)
      reply.code(404).send({
        state: {
          'pages': {
            [key]: {
              'appbarInherited': 'default-notfound',
              'contentInherited': 'default-notfound',
              'layout': 'layout_centered',
              'data': { 'message': `Page not found!` },
            }
          }
        }
      } as TJsonapiStateResponse)
    }
  } catch (e) {
    task_end(MSG_500_ERROR_MESSAGE)
    log_err('POST state page', e)
    reply.code(500).send(default_500_error_response(e))
  }
}