import { FastifyReply } from 'fastify'
import { default_500_error_response } from '../business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from '../business.logic/jsonapi.response.builder'
import { exclude_user_fields, get_user_collection } from '../model/user'
import { TUsersFastifyRequest } from '../schema/users'
import Config from '../config'
import { DEFAULT_500_ERROR_MESSAGE } from '../constants'

export default async function get_users_collection_endpoint (
  req: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    const result = await get_user_collection(req)
    const userDocs = result.docs
    reply.code(200).send(
      new JsonapiResponseBuilder(userDocs, 'users', 'collection')
      .setResourceFilter(exclude_user_fields)
      .buildPaginationV2Links(result)
      .mPaginationV2build()
    )
  } catch (e: any) {
    Config.log(DEFAULT_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}