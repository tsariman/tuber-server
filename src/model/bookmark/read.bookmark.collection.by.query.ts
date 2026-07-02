import { PaginateResult, Types } from 'mongoose'
import Config from '../../config'
import { TSearchMode } from '../../common.types'
import { TContextualUser } from '../../schema/user'
import { BookmarkVoteModel } from '../bookmark.vote'
import { IBookmarkDocument } from '../../schema/bookmark'
import { BookmarkModel } from './index'
import get_bookmark_search_query_pipeline from './get.bookmark.search.query.pipeline'
import { DB_PAGINATION_QUERY } from '@tuber/shared'

const NO_SEARCH_PRIVATE_RECENTS_LIMIT = 25

export type TBookmarkVoteMap = Map<string, { rating: 1 | -1; bookmark_id: string }>

export interface IBookmarkCollectionQueryInput {
  page?: number
  limit?: number
  searchQuery?: string
  searchMode?: TSearchMode
  usr?: TContextualUser
}

export interface IBookmarkCollectionQueryResult {
  docs: IBookmarkDocument<Types.ObjectId>[]
  totalItems: number
  page: number
  limit: number
  searchQuery?: string
  searchMode?: TSearchMode
  filter?: string
  pagination?: PaginateResult<IBookmarkDocument<Types.ObjectId>>
}

/** Clamp the bookmarks page number to valid lower bound. */
export const get_normalized_bookmark_page = (requestedPage?: number): number => {
  return Math.max(1, requestedPage ?? 1)
}

/** Clamp bookmarks page size to the allowed [1..100] range. */
export const get_normalized_bookmark_limit = (requestedLimit?: number): number => {
  const fallbackLimit = parseInt(Config.PAGINATION_BOOKMARKS_LIMIT)
  return Math.max(1, Math.min(100, requestedLimit ?? fallbackLimit))
}

export const build_bookmark_filter_query = (
  searchQuery?: string,
  searchMode?: TSearchMode
): string => {
  const safeSearch = typeof searchQuery === 'string' ? searchQuery.trim() : ''
  if (!safeSearch) {
    return ''
  }

  const filterParts = [`filter[search]=${encodeURIComponent(safeSearch)}`]
  if (searchMode) {
    filterParts.push(`filter[mode]=${encodeURIComponent(searchMode)}`)
  }
  return filterParts.join('&')
}

const get_effective_search_mode = (
  searchMode: TSearchMode | undefined,
  usr?: TContextualUser
): TSearchMode | undefined => {
  if (!usr?._id) {
    if (searchMode === 'private' || searchMode === 'all') {
      return 'public'
    }
  }
  return searchMode
}

/**
 * Fetch bookmark collection with optional search mode support.
 *
 * When `searchQuery` is present, this uses the aggregation pipeline.
 * Otherwise, it falls back to standard pagination.
 */
export const read_bookmark_collection_by_query = async (
  input: IBookmarkCollectionQueryInput
): Promise<IBookmarkCollectionQueryResult> => {
  const page = get_normalized_bookmark_page(input.page)
  const limit = get_normalized_bookmark_limit(input.limit)
  const searchMode = get_effective_search_mode(input.searchMode, input.usr)
  const searchQuery = typeof input.searchQuery === 'string'
    ? input.searchQuery.trim()
    : ''

  if (searchQuery) {
    const pipeline = get_bookmark_search_query_pipeline({
      searchQuery,
      page,
      limit,
      searchMode
    }, input.usr)
    const aggregationResult = await BookmarkModel.aggregate(pipeline)
    const { totalItems = 0, results = [] } = aggregationResult[0] || {}

    return {
      docs: results,
      totalItems,
      page,
      limit,
      searchQuery,
      searchMode,
      filter: build_bookmark_filter_query(searchQuery, searchMode)
    }
  }

  // No-search behavior by mode:
  // - public/all: do not include collection (empty list)
  // - private: include user's most recent bookmarks (25 per page)
  if (searchMode === 'public' || searchMode === 'all') {
    return {
      docs: [],
      totalItems: 0,
      page,
      limit,
      searchMode
    }
  }

  if (searchMode === 'private') {
    if (!input.usr?._id) {
      return {
        docs: [],
        totalItems: 0,
        page,
        limit: NO_SEARCH_PRIVATE_RECENTS_LIMIT,
        searchMode
      }
    }

    const privateLimit = NO_SEARCH_PRIVATE_RECENTS_LIMIT
    const skip = (page - 1) * privateLimit
    const privateFilter = {
      ...DB_PAGINATION_QUERY,
      user_id: String(input.usr._id)
    }

    const [docs, totalItems] = await Promise.all([
      BookmarkModel.find(privateFilter)
        .sort({ created_at: -1, _id: -1 })
        .skip(skip)
        .limit(privateLimit),
      BookmarkModel.countDocuments(privateFilter)
    ])

    return {
      docs,
      totalItems,
      page,
      limit: privateLimit,
      searchMode
    }
  }

  const skip = (page - 1) * limit
  const visibilityFilter = input.usr?._id
    ? {
      ...DB_PAGINATION_QUERY,
      $or: [
        { is_published: { $eq: true } },
        { user_id: String(input.usr._id) }
      ]
    }
    : {
      ...DB_PAGINATION_QUERY,
      is_published: { $eq: true }
    }

  const [docs, totalItems] = await Promise.all([
    BookmarkModel.find(visibilityFilter)
      .sort({ created_at: -1, _id: -1 })
      .skip(skip)
      .limit(limit),
    BookmarkModel.countDocuments(visibilityFilter)
  ])

  return {
    docs,
    totalItems,
    page,
    limit,
  }
}

/**
 * Build a bookmark-vote lookup map for the current user, scoped to loaded docs.
 */
export const read_bookmark_votes_for_user = async (
  usr: TContextualUser | undefined,
  docs: IBookmarkDocument<Types.ObjectId>[]
): Promise<TBookmarkVoteMap | undefined> => {
  if (!usr?._id || docs.length === 0) {
    return undefined
  }

  const bookmarkIds = docs
    .map((bookmark) => bookmark._id)
    .map((id: unknown) => String(id))

  if (bookmarkIds.length === 0) {
    return undefined
  }

  const votes = await BookmarkVoteModel.find(
    {
      user_id: String(usr._id),
      bookmark_id: { $in: bookmarkIds }
    },
    {
      bookmark_id: 1,
      rating: 1
    }
  )

  return new Map(
    votes.map((vote) => [
      vote.bookmark_id,
      { rating: vote.rating as 1 | -1, bookmark_id: vote.bookmark_id }
    ])
  )
}
