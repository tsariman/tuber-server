import { PaginateModel, PaginateResult, model } from 'mongoose'
import configurationSchema, {
  IDbConfigurationDocument
} from '../../schema/configurations'
import { DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from '../../constants'

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
}

type TSelect = { [key in keyof IDbConfigurationDocument]: 0|1 }

/** mongoose-paginate-v2 options */
const PAGINATION_OPTONS = {
  ...DB_PAGINATION_OPTIONS,
  select: {
    ...DB_PAGINATION_OPTIONS.select,
    // TODO Insert fields to exclude here e.g.
    // 'password': 0,
  } as TSelect
  // TODO Add custom pagination options here
}

/**
 * Get the configuration collection. This is a mongoose-paginate-v2 model used
 * for pagination. 
 */
export const ConfigurationPaginationModel = model<
  IDbConfigurationDocument,
  PaginateModel<IDbConfigurationDocument>
>('configurations', configurationSchema)

/**
 * Get the configuration collection. This is a mongoose model used for
 * non-paginated queries.
 */
export const ConfigurationModel = model<IDbConfigurationDocument>(
  'configurations',
  configurationSchema
)

/**
 * Get configuration collection.
 *
 * @param page Page number
 * @param limit Number of items per page
 */
export async function configuration_get_collection(
  page: number,
  limit: number
): Promise<PaginateResult<IDbConfigurationDocument>> {
  return await ConfigurationPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  })
}

/**
 * Get entire configuration collection.
 *
 * @returns entire collection as an array
 */
export async function configuration_get_entire_collection(): Promise<IDbConfigurationDocument[]> {
  return await ConfigurationModel.find(PAGINATION_QUERY, PAGINATION_OPTONS)
}

/**
 * Get a configuration by key. 
 * 
 * @param key Configuration key
 * @returns configuration document or null
 */
export async function configuration_get(
  key: string
): Promise<IDbConfigurationDocument|null> {
  return await ConfigurationModel.findOne({ key })
}

/**
 * Save a configuration. If the configuration already exists, it will be
 * updated.
 *
 * @param key of the configuration
 * @param value of the configuration
 * @returns a configuration document
 */
export async function configuration_save (
  key: string,
  value: string
): Promise<IDbConfigurationDocument> {
  const doc = await ConfigurationModel.findOneAndUpdate(
    { key },
    { value },
    { new: true, upsert: true }
  )
  return doc
}
