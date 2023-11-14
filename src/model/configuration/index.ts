import { PaginateModel, PaginateResult, model } from 'mongoose'
import configurationSchema, {
  IDbConfigurationDocument
} from '../../schema/configurations'
import Config from '../../config'

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...Config.DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
}

type TSelect = { [key in keyof IDbConfigurationDocument]: 0|1 }

/** mongoose-paginate-v2 options */
const PAGINATION_OPTONS = {
  ...Config.DB_PAGINATION_OPTIONS,
  select: {
    ...Config.DB_PAGINATION_OPTIONS.select,
    // TODO Insert fields to exclude here e.g.
    // 'password': 0,
  } as TSelect
  // TODO Add custom pagination options here
}

export const ConfigurationPaginationModel = model<
  IDbConfigurationDocument,
  PaginateModel<IDbConfigurationDocument>
>('configurations', configurationSchema)

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

export async function configuration_get_entire_collection(): Promise<IDbConfigurationDocument[]> {
  return await ConfigurationModel.find(PAGINATION_QUERY, PAGINATION_OPTONS)
}

export async function configuration_get(
  key: string
): Promise<IDbConfigurationDocument|null> {
  return await ConfigurationModel.findOne({ key })
}

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