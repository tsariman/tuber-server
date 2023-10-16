import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from '../business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from '../business.logic/jsonapi.response.builder'
import { exclude_user_fields, get_user_collection } from '../model/user'
import { TUsersFastifyRequest } from '../schema/users'

export default async function users_get_collection_endpoint (
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
    reply.code(500).send(new JsonapiErrorBuilder()
      .status(500)
      .title('Internal Server Error')
      .detail(e.message)
      .build()
    )
  }
}