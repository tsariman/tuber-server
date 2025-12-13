import { model, PaginateModel, PaginateResult, Types } from 'mongoose'
import { IMPV2Doc, TSelect } from '../../common.types'
import bookmarkSchema, {
  IBookmark,
  IBookmarkDocument,
  TBookmark,
} from '../../schema/bookmark'
import {
  DB_PAGINATION_OPTIONS,
  DB_PAGINATION_QUERY,
  EP_BOOKMARKS,
  IJsonapiResource,
  IJsonapiResponseResource
} from '@tuber/shared'
import { TContextualUser } from '../../schema/user'

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
}

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
}

export const BookmarkPaginationModel = model<
  IBookmarkDocument,
  PaginateModel<IBookmarkDocument>
>('bookmarks', bookmarkSchema)

export const BookmarkModel = model<TBookmark>('bookmarks', bookmarkSchema)

/** Exclude fields from the bookmark document. @deprecated */
export const exclude_bookmark_fields_IMPV2Doc = (
  bookmark: IMPV2Doc<IBookmarkDocument>
) => {
  const {
    _doc: {
      _id,
      is_active,
      is_private,
      restrictions,
      rules,
      __v,
      ...bookmarkDoc
    }
  } = bookmark
  return bookmarkDoc
}

/** Excludes sensitive fields from the bookmark document. */
export const transform_bookmark_doc = (bookmark: IBookmarkDocument) => {
  const { _id, is_active, is_private, restrictions, rules, ...bookmarkDoc } = bookmark
  return bookmarkDoc
}

export const read_bookmark_by_id = async function (
  id: string
): Promise<IBookmarkDocument | null> {
  const bookmarkDoc = await BookmarkModel.findById(id)
  if (bookmarkDoc && !bookmarkDoc.is_active) {
    return null
  }
  return bookmarkDoc
}

export const update_bookmark_by_id = async function (
  id: string,
  attributes: IBookmark
): Promise<IBookmarkDocument | null> {
  const bookmark = await BookmarkModel.findByIdAndUpdate(
    id,
    { ...attributes, modified_at: new Date() },
    { new: true }
  )
  return bookmark
}

export const delete_bookmark_by_id = async function (
  id: string
): Promise<IBookmarkDocument | null> {
  const bookmark = await BookmarkModel.findByIdAndUpdate(
    id,
    { is_active: false },
    { new: true }
  )
  return bookmark
}

export const create_bookmark = async function (
  bookmarkInfo?: IBookmark
): Promise<IBookmarkDocument> {
  if (!bookmarkInfo) {
    throw new Error('Bookmark info is required')
  }
  const bookmarkModel = await BookmarkPaginationModel.create(bookmarkInfo)
  const bookmark = await bookmarkModel.save()
  return bookmark
}

export const read_bookmark_collection = async function (
  page: number,
  limit: number
): Promise<PaginateResult<IBookmarkDocument<Types.ObjectId>>> {
  const result = await BookmarkPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTIONS,
    page,
    limit
  })
  return result as PaginateResult<IBookmarkDocument<Types.ObjectId>>
}

export const read_bookmark_document_count = async function (): Promise<number> {
  const count = await BookmarkModel.countDocuments()
  return count
}

/** Excludes _id from the bookmark document. */
export const exclude_bookmark_id = (bookmarkDoc: IBookmarkDocument): IBookmark => {
  const { _id, __v, ...bookmark } = typeof bookmarkDoc.toObject === 'function'
    ? bookmarkDoc.toObject()
    : bookmarkDoc
  return bookmark
}

/**
 * Get user votes for a list of bookmark IDs
 * @param userId The user's ID
 * @param bookmarkIds Array of bookmark IDs to look up votes for
 * @returns Map of bookmark IDs to vote ratings (1 or -1)
 */
export const get_user_votes_for_bookmarks = (
  user: TContextualUser | null | undefined,
  bookmarkIds: string[]
): Map<string, { rating: 1 | -1; bookmark_id: string }> => {
  const voteMap = new Map<string, { rating: 1 | -1; bookmark_id: string }>()
  
  if (!user || !user._id) {
    return voteMap
  }
  
  // This will need to read from the user.votes array
  // Since we don't have the full user document here, this function
  // will be called with the votes already looked up
  return voteMap
}

/**
 * Converts bookmarks from MongoDB documents to JSON:API resources.
 * Optionally includes user votes as relationships and included documents.
 * @param documents Array of bookmark documents
 * @param userVotes Optional map of bookmark IDs to vote data
 * @returns Object containing resources and optional included votes
 */
export const to_jsonapi_bookmark_resources = (
  documents: IBookmarkDocument<Types.ObjectId>[],
  userVotes?: Map<string, { rating: 1 | -1; bookmark_id: string }>
): { 
  resources: IJsonapiResource<IBookmark>[] 
  included: IJsonapiResponseResource[] 
} => {
  const included: IJsonapiResponseResource[] = []
  
  const resources: IJsonapiResource<IBookmark>[] = documents.map(bookmark => {
    const bookmarkId = bookmark._id?.toString() ?? ''
    const resource: IJsonapiResource<IBookmark> = {
      type: EP_BOOKMARKS,
      id: bookmarkId,
      attributes: exclude_bookmark_id(bookmark)
    }
    
    // Add user vote relationship if available
    if (userVotes && userVotes.has(bookmarkId)) {
      const vote = userVotes.get(bookmarkId)!
      
      // Add relationship to the bookmark
      resource.relationships = {
        'user-vote': {
          data: {
            type: 'user-votes',
            id: `${bookmarkId}`
          }
        }
      }
      
      // Add the vote to included documents
      included.push({
        type: 'user-votes',
        id: `${bookmarkId}`,
        attributes: {
          bookmark_id: vote.bookmark_id,
          rating: vote.rating
        }
      })
    }
    
    return resource
  })
  
  return { resources, included }
}