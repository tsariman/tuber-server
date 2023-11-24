import { FastifyRequest } from 'fastify'
import { IJsonapiQuerystring } from 'src/common.types'
import { IBookmarkGet } from 'src/schema/bookmarks'

type IFastifyRequest = FastifyRequest<IBookmarkGet>
type TQueryKeys = keyof IJsonapiQuerystring

export const get_query_string_args = (
  req: IFastifyRequest,
  key: TQueryKeys
): string | undefined => {
  const query =req.query[key]
  return query
}