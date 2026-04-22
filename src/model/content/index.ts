import { PaginateModel, PaginateResult, model } from 'mongoose'
import contentSchema, { IContentDocument } from '../../schema/content'
import { DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from '@tuber/shared'

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,
}

type TSelect = { [key in keyof IContentDocument]: 0 | 1 }

/** mongoose-paginate-v2 options */
const PAGINATION_OPTIONS = {
  ...DB_PAGINATION_OPTIONS,
  select: {
    ...(DB_PAGINATION_OPTIONS.select as TSelect),
  } as TSelect,
}

/**
 * Mongoose model for paginated queries on the `contents` collection.
 */
export const ContentPaginationModel = model<
  IContentDocument,
  PaginateModel<IContentDocument>
>('Contents', contentSchema, 'contents')

/**
 * Mongoose model for non-paginated queries on the `contents` collection.
 */
export const ContentModel = model<IContentDocument>('contents', contentSchema)

/**
 * Get a page of the contents collection.
 */
export async function content_get_collection(
  page: number,
  limit: number
): Promise<PaginateResult<IContentDocument>> {
  return await ContentPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTIONS,
    page,
    limit,
  })
}

/**
 * Get the entire contents collection.
 */
export async function content_get_all(): Promise<IContentDocument[]> {
  return await ContentModel.find(PAGINATION_QUERY, PAGINATION_OPTIONS)
}

/**
 * Get a single content block by its unique name.
 *
 * @param name The identifier used in page state, e.g. `'privacy-policy'`
 */
export async function content_get_by_name(
  name: string
): Promise<IContentDocument | null> {
  return await ContentModel.findOne({ ...PAGINATION_QUERY, name })
}

/**
 * Create a new content block.
 */
export async function content_create(
  data: Pick<IContentDocument, 'name' | 'html' | 'description'>
): Promise<IContentDocument> {
  return await ContentModel.create(data)
}
