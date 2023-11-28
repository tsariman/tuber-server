import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/jsonapi.error.builder'
import Config from '../../config'
import DEV_STATE_PAGES, { DEV_STATE_PAGES_THEME_DARK } from '../page'
import { TNetState } from '../../common.types'
import { MSG_500_ERROR_MESSAGE } from '../../constants'
import { themed_by_key } from '../../business.logic'

export default async function dev_post_state_pages_endpoint(
  req: FastifyRequest<{ Body: { key?: string }}>,
  reply: FastifyReply
) {
  try {
    const key = req.body.key
    if (!key) {
      Config.log(`'key' was not received.`)
      reply.code(400).send(new JsonapiErrorBuilder()
        .status(400)
        .code('bad_request')
        .title('Missing information')
      )
      return
    }
    Config.print(`Loading '${key}' state... `)
    const pageState = themed_by_key(key, DEV_STATE_PAGES, DEV_STATE_PAGES_THEME_DARK)
    if (pageState) {
      Config.log('Done.')
      reply.code(200).send({
        state: {
          'pages': { [key]: pageState },
          'pagesLight': { [key]: DEV_STATE_PAGES[key] },
          'pagesDark': { [key]: DEV_STATE_PAGES_THEME_DARK[key] },
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