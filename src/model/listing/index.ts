import { model, PaginateModel, PaginateResult } from 'mongoose';
import { TSelect } from 'src/common.types';
import { DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from '@tuber/shared';
import listingSchema, { IListing, IListingDocument, TListing } from '../../schema/listings';

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
};

/** mongoose-paginate-v2 options */
const PAGINATION_OPTIONS = {
  ...DB_PAGINATION_OPTIONS,
  select: {
    ...(DB_PAGINATION_OPTIONS.select as TSelect<IListingDocument>),
    is_private: 0,
    is_published: 0,
    // TODO Insert fields to exclude here e.g.
    // 'password': 0,
  } as TSelect<IListingDocument>
  // TODO Add custom pagination options here
};

export const ListingPaginationModel = model<
  IListingDocument,
  PaginateModel<IListingDocument>
>('listings', listingSchema);

export const ListingModel = model<TListing>('listings', listingSchema);

export const read_listing_by_id = async function (
  id: string
): Promise<IListingDocument | null> {
  const listingDoc = await ListingPaginationModel.findById(id);
  return listingDoc;
};

export const create_listing = async function (
  listingInfo?: IListing
): Promise<IListingDocument> {
  if (!listingInfo) {
    throw new Error('Listing info is required');
  }
  const listingModel = await ListingPaginationModel.create(listingInfo);
  const listing = await listingModel.save();
  return listing;
};

export const read_listing_collection = async function (
  page: number,
  limit: number
): Promise<PaginateResult<IListingDocument>> {
  const result = await ListingPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTIONS,
    page,
    limit
  });
  return result;
}

export const read_listing_document_count = async function(): Promise<number> {
  const count = await ListingModel.countDocuments();
  return count;
};
