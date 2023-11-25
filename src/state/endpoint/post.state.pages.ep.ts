import { FastifyReply, FastifyRequest } from 'fastify'
import Config from '../../config'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/jsonapi.error.builder'
import STATE_PAGES from '../page'
import { TNetState } from '../../common.types'
import { MSG_500_ERROR_MESSAGE } from '../../constants'

export default async function post_state_pages_endpoint (
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
    const pageState = STATE_PAGES[key]
    if (pageState) {
      Config.log('Done.')
      reply.code(200).send({
        state: {
          'pages': { [key]: pageState }
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