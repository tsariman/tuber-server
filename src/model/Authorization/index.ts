import authorizationSchema, {
  IAuthorizationDocument,
  IAuthorizationKey,
  IAuthorizationUrl,
  TAuthorizationKeyNew
} from 'src/schema/authorizations'
import { PaginateModel, PaginateResult, model } from 'mongoose'
import { TPlatform } from 'src/common.types'
import { DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from '../../constants'

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
}

/** mongoose-paginate-v2 options */
const PAGINATION_OPTONS = {
  ...DB_PAGINATION_OPTIONS,
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

export async function authorization_get_by_platform(
  platform: string
): Promise<IAuthorizationDocument|null> {
  return await AuthorizationPaginationModel.findOne({ platform })
}

export async function authorization_get_collection(
  page: number,
  limit: number
): Promise<PaginateResult<IAuthorizationDocument>> {
  return await AuthorizationPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  })
}

/**
 * Save authorization credentials in the database.
 * @param platform Video platform e.g. `youtube`, `twitch`... etc.
 * @param key Authorization key object.
 */
export async function authorization_key_save(
  platform: TPlatform,
  key: TAuthorizationKeyNew
): Promise<void> {
  const authorizationDoc = await authorization_get_by_platform(platform)
  if (authorizationDoc) {
    const keyIndex = authorizationDoc.keys.findIndex(
      k => k.name === key.name
    )
    if (keyIndex > -1) {
      authorizationDoc.keys[keyIndex].value = key.value
      authorizationDoc.keys[keyIndex].expires_at = key.expires_at
      authorizationDoc.keys[keyIndex].modified_at = new Date()
    } else {
      authorizationDoc.keys.push(key)
    }
    await authorizationDoc.save()
  } else {
    const authorization = new AuthorizationModel({
      platform,
      keys: [ key ]
    })
    await authorization.save()
  }
}

/**
 * Get authorization credentials from the database as an object where the
 * propery is the `key.name` and the value is the key object.
 *
 * @param platform Video platform e.g. `youtube`, `twitch`... etc.
 * @return the object as a `Promise` or `null` if no keys are found.
 */
export async function authorization_keys_get_obj(
  platform: TPlatform
): Promise<Record<string, IAuthorizationKey> | null> {
  const authorizationDoc = await authorization_get_by_platform(platform)
  if (!authorizationDoc) {
    return null
  }
  const keys: Record<string, IAuthorizationKey> = {}
  authorizationDoc.keys.map(key => keys[key.name] = key)
  if (Object.keys(keys).length > 0) {
    return keys
  }
  return null
}

/**
 * Given the platform, it will return the key with the associated
 * name.
 * @param platform Video platform e.g. `youtube`, `twitch`... etc.
 * @param name Key name.
 */
export async function authorization_key_get(
  platform: TPlatform,
  name: string
): Promise<IAuthorizationKey|null> {
  const keys = await authorization_keys_get_obj(platform)
  if (keys) {
    return keys[name]
  }
  return null
}

/**
 * Remove all authorization keys from the database.
 * @param platform Video platform e.g. `youtube`, `twitch`... etc.
 * @return the object as a `Promise`
 */
export async function authorization_key_clear_all(
  platform: TPlatform
): Promise<void> {
  const authorizationDoc = await authorization_get_by_platform(platform)
  if (!authorizationDoc) {
    return
  }
  authorizationDoc.keys = []
  await authorizationDoc.save()
}

export async function authorization_url_save(
  platform: TPlatform,
  url: IAuthorizationUrl
): Promise<void> {
  const authorizationDoc = await authorization_get_by_platform(platform)
  if (authorizationDoc && authorizationDoc.urls) {
    const urlIndex = authorizationDoc.urls.findIndex(
      (u: IAuthorizationUrl) => u.purpose === url.purpose
    )
    if (urlIndex > -1) {
      authorizationDoc.urls[urlIndex].url = url.url
      authorizationDoc.urls[urlIndex].modified_at = new Date()
    } else {
      authorizationDoc.urls.push(url)
    }
    await authorizationDoc.save()
  } else {
    const authorization = new AuthorizationModel({
      platform,
      urls: [ url ]
    })
    await authorization.save()
  }
}

/**
 * Given an authorization document, it will return the key with the associated
 * purpose.
 */
export async function authorization_url_get(
  platform: TPlatform,
  purpose: string
): Promise<IAuthorizationUrl | null> {
  const authorizationDoc = await authorization_get_by_platform(platform)
  if (!authorizationDoc || !authorizationDoc.urls) {
    return null
  }
  const urlIndex = authorizationDoc.urls.findIndex(
    (u: IAuthorizationUrl) => u.purpose === purpose
  )
  if (urlIndex > -1) {
    return authorizationDoc.urls[urlIndex]
  }
  return null
}

export async function authorization_url_get_all(
  platform: TPlatform
): Promise<IAuthorizationUrl[]> {
  const authorizationDoc = await authorization_get_by_platform(platform)
  if (!authorizationDoc || !authorizationDoc.urls) {
    return []
  }
  return authorizationDoc.urls
}

export async function authorization_url_delete(
  platform: TPlatform,
  purpose: string
) {
  const authorizationDoc = await authorization_get_by_platform(platform)
  if (!authorizationDoc || !authorizationDoc.urls) {
    return
  }
  const urlIndex = authorizationDoc.urls.findIndex(
    (u: IAuthorizationUrl) => u.purpose === purpose
  )
  if (urlIndex > -1) {
    authorizationDoc.urls.splice(urlIndex, 1)
    await authorizationDoc.save()
  }
}

export async function authorization_url_delete_all(platform: TPlatform) {
  const authorizationDoc = await authorization_get_by_platform(platform)
  if (!authorizationDoc || !authorizationDoc.urls) {
    return
  }
  authorizationDoc.urls = []
  await authorizationDoc.save()
}
