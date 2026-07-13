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

interface IResolveBookmarkPageByQueryInput {
  limit?: number
  searchQuery?: string
  searchMode?: TSearchMode
  usr?: TContextualUser
  playingBookmarkKey: string
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

export const build_bookmark_search_mode_filter = (
  searchMode?: TSearchMode
): string => {
  if (!searchMode) {
    return ''
  }

  return `filter[mode]=${encodeURIComponent(searchMode)}`
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

const to_object_id_or_undefined = (value?: string): Types.ObjectId | undefined => {
  if (!value || !Types.ObjectId.isValid(value)) {
    return undefined
  }
  return new Types.ObjectId(value)
}

const build_search_mode_match_conditions = (
  searchMode: TSearchMode | undefined,
  usr?: TContextualUser
): unknown[] => {
  switch (searchMode) {
    case 'private':
      return usr?._id ? [{ user_id: String(usr._id) }] : [{ _id: null }]
    case 'public':
      return [{ is_published: { $eq: true } }]
    case 'all':
    default:
      if (usr?._id) {
        return [
          { is_published: { $eq: true } },
          { user_id: String(usr._id) }
        ]
      }
      return [{ is_published: { $eq: true } }]
  }
}

const get_non_search_visibility_filter = (
  searchMode: TSearchMode | undefined,
  usr?: TContextualUser
): Record<string, unknown> | undefined => {
  if (searchMode === 'public' || searchMode === 'all') {
    return undefined
  }

  if (searchMode === 'private') {
    if (!usr?._id) {
      return undefined
    }

    return {
      ...DB_PAGINATION_QUERY,
      user_id: String(usr._id)
    }
  }

  if (usr?._id) {
    return {
      ...DB_PAGINATION_QUERY,
      $or: [
        { is_published: { $eq: true } },
        { user_id: String(usr._id) }
      ]
    }
  }

  return {
    ...DB_PAGINATION_QUERY,
    is_published: { $eq: true }
  }
}

const get_page_for_desc_created_at_sort = async ({
  bookmarkObjectId,
  visibilityFilter,
  limit
}: {
  bookmarkObjectId: Types.ObjectId
  visibilityFilter: Record<string, unknown>
  limit: number
}): Promise<number | undefined> => {
  const target = await BookmarkModel.findOne({
    ...visibilityFilter,
    _id: bookmarkObjectId
  }).select({ _id: 1, created_at: 1 })

  if (!target) {
    return undefined
  }

  const countBefore = await BookmarkModel.countDocuments({
    ...visibilityFilter,
    $or: [
      { created_at: { $gt: target.created_at } },
      {
        created_at: target.created_at,
        _id: { $gt: target._id }
      }
    ]
  })

  return Math.floor(countBefore / limit) + 1
}

/**
 * Resolve which page contains a playing bookmark for the active query context.
 * Returns undefined if the key does not resolve in the active result set.
 */
export const resolve_bookmark_page_by_query = async (
  input: IResolveBookmarkPageByQueryInput
): Promise<number | undefined> => {
  const bookmarkObjectId = to_object_id_or_undefined(input.playingBookmarkKey)
  if (!bookmarkObjectId) {
    return undefined
  }

  const searchMode = get_effective_search_mode(input.searchMode, input.usr)
  const searchQuery = typeof input.searchQuery === 'string'
    ? input.searchQuery.trim()
    : ''

  if (searchQuery) {
    const limit = get_normalized_bookmark_limit(input.limit)
    const matchConditions = build_search_mode_match_conditions(searchMode, input.usr)
    const matchQuery = { ...DB_PAGINATION_QUERY } as Record<string, unknown>
    if (matchConditions.length > 0) {
      matchQuery.$or = matchConditions
    }

    const targetScorePipeline = [
      {
        $search: {
          index: Config.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME,
          text: {
            query: searchQuery,
            path: ['title', 'note'],
            fuzzy: {}
          }
        }
      },
      { $match: matchQuery },
      { $addFields: { __search_score: { $meta: 'searchScore' } } },
      { $match: { _id: bookmarkObjectId } },
      {
        $project: {
          _id: 0,
          score: '$__search_score'
        }
      },
      { $limit: 1 }
    ]

    const targetScoreResult = await BookmarkModel.aggregate<{ score: number }>(targetScorePipeline)
    const targetScore = targetScoreResult[0]?.score

    if (typeof targetScore !== 'number') {
      return undefined
    }

    const countAheadPipeline = [
      {
        $search: {
          index: Config.DB_ATLAS_BOOKMARK_SEARCH_INDEX_NAME,
          text: {
            query: searchQuery,
            path: ['title', 'note'],
            fuzzy: {}
          }
        }
      },
      { $match: matchQuery },
      { $addFields: { __search_score: { $meta: 'searchScore' } } },
      {
        $match: {
          $or: [
            { __search_score: { $gt: targetScore } },
            {
              __search_score: targetScore,
              _id: { $gt: bookmarkObjectId }
            }
          ]
        }
      },
      { $count: 'countAhead' }
    ]

    const countAheadResult = await BookmarkModel.aggregate<{ countAhead: number }>(countAheadPipeline)
    const countAhead = countAheadResult[0]?.countAhead ?? 0
    return Math.floor(countAhead / limit) + 1
  }

  const visibilityFilter = get_non_search_visibility_filter(searchMode, input.usr)
  if (!visibilityFilter) {
    return undefined
  }

  const limit = searchMode === 'private'
    ? NO_SEARCH_PRIVATE_RECENTS_LIMIT
    : get_normalized_bookmark_limit(input.limit)

  return get_page_for_desc_created_at_sort({
    bookmarkObjectId,
    visibilityFilter,
    limit
  })
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
  const isAuthenticated = Boolean(input.usr?._id)
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
  // - unauthenticated + no mode/search: do not include collection (empty list)
  if (!isAuthenticated) {
    return {
      docs: [],
      totalItems: 0,
      page,
      limit,
      searchMode,
      filter: build_bookmark_search_mode_filter(searchMode)
    }
  }

  if (searchMode === 'public' || searchMode === 'all') {
    return {
      docs: [],
      totalItems: 0,
      page,
      limit,
      searchMode,
      filter: build_bookmark_search_mode_filter(searchMode)
    }
  }

  if (searchMode === 'private') {
    if (!input.usr?._id) {
      return {
        docs: [],
        totalItems: 0,
        page,
        limit: NO_SEARCH_PRIVATE_RECENTS_LIMIT,
        searchMode,
        filter: build_bookmark_search_mode_filter(searchMode)
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
      searchMode,
      filter: build_bookmark_search_mode_filter(searchMode)
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
    filter: build_bookmark_search_mode_filter(searchMode)
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
