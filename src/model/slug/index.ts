import { PaginateModel, PaginateResult, model } from 'mongoose';
import slugSchema, {
  IDbSlugDocument
} from 'src/schema/slugs';
import {DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from '../../constants';

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
};

type TSelect = { [key in keyof IDbSlugDocument]: 0|1 };

/** mongoose-paginate-v2 options */
const PAGINATION_OPTIONS = {
  ...DB_PAGINATION_OPTIONS,
  select: {
    ...DB_PAGINATION_OPTIONS.select,
    // TODO Insert fields to exclude here e.g.
    // 'password': 0,
  } as TSelect,
  // TODO Add custom pagination options here
};

/**
 * Mongoose-paginate-v2 model for paginating the URL slug collection
 */
export const SlugPaginationModel = model<
  IDbSlugDocument,
  PaginateModel<IDbSlugDocument>
>('Slugs', slugSchema, 'slugs');

export const SlugModel = model<IDbSlugDocument>('slugs', slugSchema);

/** Get slug collection */
export async function slug_get_collection(
  page: number,
  limit: number
): Promise<PaginateResult<IDbSlugDocument>> {
  return await SlugPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTIONS,
    page,
    limit
  });
}

/**
 * Given the id, get the slug.
 * 
 * @param id Slug id
 */
export async function slug_get(id: string): Promise<IDbSlugDocument|null> {
  return await SlugModel.findById(id);
}
