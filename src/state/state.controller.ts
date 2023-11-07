import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { DEFAULT_OPTIONS } from '../middleware/router.option'
import Config from '../config'
import { INetState } from '../../../tuber-client/src/controllers/interfaces/IState'
import JsonapiErrorBuilder from '../business.logic/jsonapi.error.builder'

interface IStatePost {
  Body: {
    key: string
  }
}

const opts = {
  ...DEFAULT_OPTIONS,
}

export default async function state_controller(fastify: FastifyInstance) {

  /**
   * PAGES
   * POST /state/pages
   */
  fastify.post<IStatePost>('/pages', opts, async function (
    req: FastifyRequest<IStatePost>,
    reply: FastifyReply
  ) {
    try {
      const key = req.body.key
      Config.print(`Loading '${key}' state... `)
      const pageState = Config.stateMapGet(key)?.state
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
  })

}