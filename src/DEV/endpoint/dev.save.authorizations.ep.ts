import { FastifyReply, FastifyRequest } from 'fastify'
import { TPlatform } from 'src/common.types'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import {
  authorization_key_save,
  authorization_url_save
} from 'src/model/authorization'
import Config from '../../config'
import JsonapiResponseBuilder from 'src/business.logic/jsonapi.response.builder'

interface IKey {
  Body: {
    platform?: TPlatform
    name?: string
    value?: string
    expires_in?: number
  }
}

interface IUrl {
  Body: {
    platform?: TPlatform
    purpose?: string
    url?: string
  }
}

export async function dev_post_authorizations_save_key_endpoint (
  req: FastifyRequest<IKey>,
  reply: FastifyReply
) {
  Config.print('Saving authorization credentials... ')
  try {
    const { platform, name, value, expires_in } = req.body
    if (!platform || !name || !value) {
      Config.log('failed.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .status(400)
        .code('bad_request')
        .title('Saving authorization failed')
        .detail('Missing information')
      )
      return
    }
    await authorization_key_save(platform, { name, value, expires_in })
    Config.log('done.')
    reply.code(200).send(new JsonapiResponseBuilder(
        req.body,
        'authorizations',
        'object'
      ).build()
    )
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

export async function dev_post_authorizations_save_url_endpoint (
  req: FastifyRequest<IUrl>,
  reply: FastifyReply
) {
  Config.print('Saving authorization credentials... ')
  try {
    const { platform, purpose, url } = req.body
    if (!platform || !purpose || !url) {
      Config.log('failed.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .status(400)
        .code('bad_request')
        .title('Saving authorization failed')
        .detail('Missing information')
      )
      return
    }
    await authorization_url_save(platform, { purpose, url })
    Config.log('done.')
    reply.code(200).send(new JsonapiResponseBuilder(
        req.body,
        'authorizations',
        'object'
      ).build()
    )
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