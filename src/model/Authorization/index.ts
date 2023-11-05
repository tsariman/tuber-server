import authorizationSchema, {
  IAuthorizationDocument, IAuthorizationKey
} from 'src/schema/authorizations'
import Config from '../../config'
import { PaginateModel, PaginateResult, model } from 'mongoose'
import { TPlatform } from 'src/business.logic/common.types'

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...Config.DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
}

/** mongoose-paginate-v2 options */
const PAGINATION_OPTONS = {
  ...Config.DB_PAGINATION_OPTIONS,
  select: {
    __v: 0,
    is_active: 0,
    restrictions: 0,
    rules: 0
  }

  // TODO Add custom pagination options here
}

export const AuthorizationPaginationModel = model<
  IAuthorizationDocument,
  PaginateModel<IAuthorizationDocument>
>('authorizations', authorizationSchema)

export const AuthorizationModel = model<IAuthorizationDocument>(
  'authorizations',
  authorizationSchema
)

export async function get_authorization_by_host(host: string) {
  return await AuthorizationPaginationModel.findOne({ host })
}

export async function get_authorization_collection(
  page: number,
  limit: number
): Promise<PaginateResult<IAuthorizationDocument>> {
  return await AuthorizationPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  })
}

/** Save authorization credentials in the database. */
export async function authorization_save(
  host: TPlatform,
  key: IAuthorizationKey
): Promise<void> {
  const authorizationDoc = await get_authorization_by_host(host)
  if (authorizationDoc) {
    const keyIndex = authorizationDoc.keys.findIndex(
      k => k.purpose === key.purpose
    )
    if (keyIndex > -1) {
      authorizationDoc.keys[keyIndex].key = key.key
    } else {
      authorizationDoc.keys.push(key)
    }
    await authorizationDoc.save()
  } else {
    const authorization = new AuthorizationModel({
      host,
      keys: [ key ]
    })
    await authorization.save()
  }
}

/** Retrieve authorization credentials from the database. */
export async function authorization_retrieve(host: string) {
  const authorizationDoc = await get_authorization_by_host(host)
  if (!authorizationDoc) {
    return null
  }
  return authorizationDoc.keys
}