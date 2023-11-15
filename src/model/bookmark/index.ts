import {
  model,
  // connect,
  // disconnect,
  PaginateModel,
  PaginateResult
} from 'mongoose'
import { IMPV2Doc } from '../../common.types'
import bookmarkSchema, {
  IBookmark,
  IBookmarkDocument,
  TBookmark,
} from '../../schema/bookmarks'
import { DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from '../../constants'

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
}

type TSelect = { [key in keyof IBookmarkDocument]: 0|1 }

/** mongoose-paginate-v2 options */
const PAGINATION_OPTIONS = {
  ...DB_PAGINATION_OPTIONS,
  select: {
    ...DB_PAGINATION_OPTIONS.select,
    is_private: 0,
    is_published: 0,
    // TODO Insert fields to exclude here e.g.
    // 'password': 0,
  } as TSelect
  // TODO Add custom pagination options here
}

export const BookmarkPaginationModel = model<
  IBookmarkDocument,
  PaginateModel<IBookmarkDocument>
>('bookmarks', bookmarkSchema)

export const BookmarkModel = model<TBookmark>('bookmarks', bookmarkSchema)

/** Exclude fields from the bookmark document. @deprecated */
export const exclude_bookmark_fields = (bookmark: IMPV2Doc) => {
  const {
    _doc: {
      _id,
      active,
      is_private,
      restrictions,
      rules,
      __v,
      ...bookmarkDoc
    }
  } = bookmark
  return bookmarkDoc
}

export const get_bookmark_by_id = async function (
  id: string
): Promise<IBookmarkDocument | null> {
  // await connect(Config.DB_URI)
  const bookmarkDoc = await BookmarkPaginationModel.findById(id)
  // await disconnect()
  return bookmarkDoc
}

export const create_bookmark = async function (
  bookmarkInfo?: IBookmark
): Promise<IBookmarkDocument> {
  if (!bookmarkInfo) {
    throw new Error('Bookmark info is required')
  }
  // await connect(Config.DB_URI)
  const bookmarkModel = await BookmarkPaginationModel.create(bookmarkInfo)
  const bookmark = await bookmarkModel.save()
  // await disconnect()
  return bookmark
}

export const get_bookmark_collection = async function (
  page: number,
  limit: number
): Promise<PaginateResult<IBookmarkDocument>> {
  // await connect(Config.DB_URI)
  const result = await BookmarkPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTIONS,
    page,
    limit
  })
  // await disconnect()
  return result
}

export const get_bookmark_document_count = async function (): Promise<number> {
  // await connect(Config.DB_URI)
  const count = await BookmarkModel.countDocuments()
  // await disconnect()
  return count
}
