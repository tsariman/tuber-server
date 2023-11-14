import { FastifyReply, FastifyRequest } from 'fastify'
import Config from '../../config'
import JsonapiErrorBuilder, {
  generic_500_error_response
} from '../../business.logic/jsonapi.error.builder'
import STATE_PAGES from '../page'
import { TNetState } from '../../common.types'

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
      Config.log('done.')
      reply.code(200).send({
        state: {
          'pages': { [key]: pageState }
        } as TNetState
      })
    } else {
      Config.log('failed.')
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
    Config.log('failed.\nInternal Server Error.', e)
    reply.code(500).send(generic_500_error_response(e))
  }
}