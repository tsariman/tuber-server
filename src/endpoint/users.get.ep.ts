import { FastifyReply } from 'fastify'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'
import JsonapiResponseBuilder from 'src/business.logic/jsonapi.response.builder'
import { get_user_collection } from 'src/model/user'
import { TUsersFastifyRequest } from 'src/schema/users'

export default async function users_get_collection_endpoint (
  _request: TUsersFastifyRequest,
  reply: FastifyReply
) {
  try {
    const result = await get_user_collection()
    const userDocs = result.docs
    reply.code(200).send(
      new JsonapiResponseBuilder(userDocs, 'users', 'collection')
      .buildLinks(result)
      .build()
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