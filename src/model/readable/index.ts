import { PaginateModel, PaginateResult, model } from 'mongoose';
import readableSchema, {
  IReadableDocument
} from '../../schema/readables';
import { DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from 'src/constants';

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
};

type TSelect = { [key in keyof IReadableDocument]: 0|1 };

/** mongoose-paginate-v2 options */
const PAGINATION_OPTONS = {
  ...DB_PAGINATION_OPTIONS,
  select: {
    ...(DB_PAGINATION_OPTIONS.select as TSelect),
    // TODO Insert fields to exclude here e.g.
    // 'password': 0,
  } as TSelect
  // TODO Add custom pagination options here
};

/**
 * Get the readable collection. This is a mongoose-paginate-v2 model used
 * for pagination. 
 */
export const ReadablePaginationModel = model<
  IReadableDocument,
  PaginateModel<IReadableDocument>
>('Readables', readableSchema, 'readables');

/**
 * Get the readable collection. This is a mongoose model used for
 * non-paginated queries.
 */
export const ReadableModel = model<IReadableDocument>(
  'readables',
  readableSchema
);


/**
 * Get readable collection.
 *
 * @param page Page number
 * @param limit Number of items per page
 */
export async function readable_get_collection(
  page: number,
  limit: number
): Promise<PaginateResult<IReadableDocument>> {
  return await ReadablePaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  });
}

/**
 * Get entire readable collection.
 *
 * @returns entire collection as an array
 */
export async function readable_get_all(): Promise<IReadableDocument[]> {
  return await ReadableModel.find(PAGINATION_QUERY, PAGINATION_OPTONS);
}
