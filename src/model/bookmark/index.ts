import { model, PaginateModel, PaginateResult } from 'mongoose';
import { IMPV2Doc, TSelect } from '../../common.types';
import bookmarkSchema, {
  IBookmark,
  IBookmarkDocument,
  TBookmark,
} from '../../schema/bookmarks';
import { DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from '../../constants.server';

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
};

/** mongoose-paginate-v2 options */
const PAGINATION_OPTIONS = {
  ...DB_PAGINATION_OPTIONS,
  select: {
    ...(DB_PAGINATION_OPTIONS.select as TSelect<IBookmarkDocument>),
    is_private: 0,
    is_published: 0,
    // TODO Insert fields to exclude here e.g.
    // 'password': 0,
  } as TSelect<IBookmarkDocument>
  // TODO Add custom pagination options here
};

export const BookmarkPaginationModel = model<
  IBookmarkDocument,
  PaginateModel<IBookmarkDocument>
>('bookmarks', bookmarkSchema);

export const BookmarkModel = model<TBookmark>('bookmarks', bookmarkSchema);

/** Exclude fields from the bookmark document. @deprecated */
export const exclude_bookmark_fields = (bookmark: IMPV2Doc<IBookmarkDocument>) => {
  const {
    _doc: {
      _id,
      is_active,
      is_private,
      restrict,
      rules,
      __v,
      ...bookmarkDoc
    }
  } = bookmark;
  return bookmarkDoc;
};

export const get_bookmark_by_id = async function (
  id: string
): Promise<IBookmarkDocument | null> {
  const bookmarkDoc = await BookmarkPaginationModel.findById(id);
  return bookmarkDoc;
};

export const create_bookmark = async function (
  bookmarkInfo?: IBookmark
): Promise<IBookmarkDocument> {
  if (!bookmarkInfo) {
    throw new Error('Bookmark info is required');
  }
  const bookmarkModel = await BookmarkPaginationModel.create(bookmarkInfo);
  const bookmark = await bookmarkModel.save();
  return bookmark;
};

export const get_bookmark_collection = async function (
  page: number,
  limit: number
): Promise<PaginateResult<IBookmarkDocument>> {
  const result = await BookmarkPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTIONS,
    page,
    limit
  });
  return result;
};

export const get_bookmark_document_count = async function (): Promise<number> {
  const count = await BookmarkModel.countDocuments()
  return count;
};
