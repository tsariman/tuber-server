import { FastifyReply, FastifyRequest } from 'fastify'
import Config from '../../config'
import JsonapiErrorBuilder from '../../business.logic/jsonapi.error.builder'
import { INetState } from '../../../../tuber-client/src/controllers/interfaces/IState'
import STATE_PAGES from '../page'

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
        } as INetState
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
        } as INetState
      })
    }
  } catch (e: any) {
    Config.log('failed.\nInternal Server Error.', e)
    reply.code(500).send(new JsonapiErrorBuilder()
      .status(500)
      .code('internal_server_error')
      .title(e.message)
      .detail(e.stack)
      .build()
    )
  }
}