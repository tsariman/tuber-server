import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import { errr, ler, task, task_end } from '../../utility/logging'
import DEV_STATE_PAGES, { DEV_STATE_PAGES_THEME_DARK } from '../../dev/page'
import { TNetState, MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { themed_by_key } from '../../business.logic'

export default async function dev_post_state_pages_endpoint(
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
    const pageState = themed_by_key(
      key,
      DEV_STATE_PAGES,
      DEV_STATE_PAGES_THEME_DARK
    )
    if (pageState) {
      task_end('Done.')
      reply.code(200).send({
        state: {
          'pages': { [key]: pageState },
          'pagesLight': { [key]: DEV_STATE_PAGES[key] },
          'pagesDark': { [key]: DEV_STATE_PAGES_THEME_DARK[key] },
        } as TNetState
      })
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
        } as TNetState
      })
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}