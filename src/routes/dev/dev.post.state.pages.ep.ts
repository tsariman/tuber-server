import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { errr, ler, log_err, task, task_end } from '../../utility/logging'
import DEV_STATE_PAGES, { DEV_STATE_PAGES_THEME_DARK } from '../../dev/page'
import { MSG_500_ERROR_MESSAGE, TJsonapiStateResponse } from '@tuber/shared'
import { themed_by_key } from '../../business.logic'

export default async function dev_post_state_pages_endpoint(
  req: FastifyRequest<{ Body: { key?: string }}>,
  reply: FastifyReply
) {
  task('Validating request body ')
  try {
    const key = req.body.key
    if (!key) {
      task_end('[❌]')
      errr(`'key' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_DATA')
        .withTitle('Missing information')
      )
      return
    }
    task_end('[✔️]')
    task(`Loading '${key}' state `)
    const pageState = themed_by_key(
      key,
      DEV_STATE_PAGES,
      DEV_STATE_PAGES_THEME_DARK
    )
    if (pageState) {
      task.end('[✔️]')
      reply.code(200).send({
        'state': {
          'pages': { [key]: pageState },
          'pagesLight': { [key]: DEV_STATE_PAGES[key] },
          'pagesDark': { [key]: DEV_STATE_PAGES_THEME_DARK[key] },
        }
      } as TJsonapiStateResponse)
    } else {
      task.end('[❌]')
      reply.code(404).send({
        'state': {
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
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5028]'))
    log_err('[5028] DEV POST STATE PAGES ERROR', e)
    reply.code(500).send(error_id(5028).default_500_error_response(e))
  }
}