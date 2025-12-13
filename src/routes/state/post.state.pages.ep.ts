import { FastifyReply, FastifyRequest } from 'fastify'
import { errr, log_err, task, task_end } from '../../utility/logging'
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
    const key = req.body.key
    const mode = req.body.mode
    if (!key) {
      errr(`'key' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_DATA')
        .withTitle('Missing information')
      )
      return
    }
    if (!mode) {
      errr(`'mode' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_DATA')
        .withTitle('Missing information')
      )
      return
    }
    task(`Loading '${key}' state... `)
    const light = STATE_PAGES[key]
    const dark = STATE_PAGES_THEME_DARK[key]
    const pageState = themed(light, dark, mode)
    if (pageState) {
      task_end('Done.')
      reply.code(200).send({
        state: {
          'pages': { [key]: pageState },
          'pagesLight': { [key]: STATE_PAGES[key] },
          'pagesDark': { [key]: STATE_PAGES_THEME_DARK[key] },
        }
      } as TJsonapiStateResponse)
    } else {
      task_end('Failed.')
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