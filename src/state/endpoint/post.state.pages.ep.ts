import { FastifyReply, FastifyRequest } from 'fastify'
import Config from '../../config'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/jsonapi.error.builder'
import  { STATE_PAGES, STATE_PAGES_THEME_DARK } from '../page'
import { TNetState, TThemeMode } from '../../common.types'
import { MSG_500_ERROR_MESSAGE } from '../../constants'
import { themed } from '../../business.logic'

export default async function post_state_pages_endpoint (
  req: FastifyRequest<{ Body: { key?: string, mode?: TThemeMode }}>,
  reply: FastifyReply
) {
  try {
    const key = req.body.key
    const mode = req.body.mode
    if (!key) {
      Config.log(`'key' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .status(400)
        .code('bad_request')
        .title('Missing information')
      )
      return
    }
    if (!mode) {
      Config.log(`'mode' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .status(400)
        .code('bad_request')
        .title('Missing information')
      )
      return
    }
    Config.print(`Loading '${key}' state... `)
    const light = STATE_PAGES[key]
    const dark = STATE_PAGES_THEME_DARK[key]
    const pageState = themed(light, dark, mode)
    if (pageState) {
      Config.log('Done.')
      reply.code(200).send({
        state: {
          'pages': { [key]: pageState },
          'pagesLight': { [key]: STATE_PAGES[key] },
          'pagesDark': { [key]: STATE_PAGES_THEME_DARK[key] },
        } as TNetState
      })
    } else {
      Config.log('Failed.')
      reply.code(404).send({
        state: {
          'pages': {
            [key]: {
              'appBarInherited': 'default-notfound',
              'contentInherited': 'default-notfound',
              'layout': 'layout_centered',
              'data': { 'message': `Page not found!` },
            }
          }
        } as TNetState
      })
    }
  } catch (e: any) {
    Config.log(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}