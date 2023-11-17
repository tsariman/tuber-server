import { FastifyReply, FastifyRequest } from 'fastify'
import { TPlatform } from '../../common.types'
import JsonapiErrorBuilder, {
  default_500_error_response
} from '../../business.logic/jsonapi.error.builder'
import {
  authorization_key_save,
  authorization_url_save
} from '../../model/authorization'
import Config from '../../config'
import JsonapiResponseBuilder from '../../business.logic/jsonapi.response.builder'
import { get_expiration_date } from '../../business.logic'
import { DEFAULT_500_ERROR_MESSAGE } from '../../constants'

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
      Config.log('Failed.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .status(400)
        .code('bad_request')
        .title('Saving authorization failed')
        .detail('Missing information')
      )
      return
    }
    const expires_at = expires_in
      ? get_expiration_date(expires_in * 1000)
      : undefined
    await authorization_key_save(platform, { name, value, expires_at })
    Config.log('Done.')
    reply.code(200).send(new JsonapiResponseBuilder(
        req.body,
        'authorizations',
        'object'
      ).build()
    )
  } catch (e: any) {
    Config.log(DEFAULT_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
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
      Config.log('Failed.')
      reply.code(400).send(new JsonapiErrorBuilder()
        .status(400)
        .code('bad_request')
        .title('Saving authorization failed')
        .detail('Missing information')
      )
      return
    }
    await authorization_url_save(platform, { purpose, url })
    Config.log('Done.')
    reply.code(200).send(new JsonapiResponseBuilder(
        req.body,
        'authorizations',
        'object'
      ).build()
    )
  } catch (e: any) {
    Config.log(DEFAULT_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}