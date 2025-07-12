import { PaginateModel, PaginateResult, model } from 'mongoose';
import countrySchema, {
  ICountryDocument
} from 'src/schema/countries';
import { DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from 'src/constants';

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
};

type TSelect = { [key in keyof ICountryDocument]: 0|1 };

/** mongoose-paginate-v2 options */
const PAGINATION_OPTONS = {
  ...DB_PAGINATION_OPTIONS,
  select: {
    ...DB_PAGINATION_OPTIONS.select,
    // TODO Insert fields to exclude here e.g.
    // 'password': 0,
  } as TSelect
  // TODO Add custom pagination options here
};

/**
 * Get the country collection. This is a mongoose-paginate-v2 model used
 * for pagination. 
 */
export const CountryPaginationModel = model<
  ICountryDocument,
  PaginateModel<ICountryDocument>
>('Countries', countrySchema, 'countries');

/**
 * Get the country collection. This is a mongoose model used for
 * non-paginated queries.
 */
export const CountryModel = model<ICountryDocument>(
  'countries',
  countrySchema
);

/**
 * Get country collection.
 *
 * @param page Page number
 * @param limit Number of items per page
 */
export async function country_get_collection(
  page: number,
  limit: number
): Promise<PaginateResult<ICountryDocument>> {
  return await CountryPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  });
}