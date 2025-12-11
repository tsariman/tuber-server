import { model, PaginateModel, PaginateResult } from 'mongoose'
import { DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from '@tuber/shared'
import bookmarkVoteSchema, {
  IBookmarkVoteDocument,
  TBookmarkVoteFastifyRequest
} from '../../schema/bookmark.vote'
import Config from '../../config'

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
}

/** mongoose-paginate-v2 options */
const PAGINATION_OPTONS = {
  ...DB_PAGINATION_OPTIONS,
  select: {
    jwt_version: 0,
    password: 0,
  },

  // TODO Add custom pagination options here
}

export const BookmarkVotePaginationModel = model<
  IBookmarkVoteDocument,
  PaginateModel<IBookmarkVoteDocument>
>('bookmarkVotes', bookmarkVoteSchema, 'bookmarkVotes')

/** Bookmark vote model with no pagination */
export const BookmarkVoteModel = model<IBookmarkVoteDocument>('BookmarkVote', bookmarkVoteSchema)

/** Excludes sensitive fields from the user document. */
export const transform_bookmark_vote_doc = (bookmarkVote: IBookmarkVoteDocument) => {
  const plainBookmarkVote = bookmarkVote.toObject()
  const { jwt_version, is_active, password, restrictions, rules, _id, __v, ...bookmarkVoteDoc } = plainBookmarkVote
  return bookmarkVoteDoc
}

export const read_bookmark_vote_by_id = async (
  id: string
): Promise<IBookmarkVoteDocument | null> => {
  const bookmarkVoteDoc = await BookmarkVoteModel.findById(id).select('__v')
  return bookmarkVoteDoc
}

export const create_bookmark_vote = async (
  userId: string,
  bookmarkId: string,
  rating: 1 | -1
): Promise<IBookmarkVoteDocument | null> => {
  const vote = await BookmarkVoteModel.create({
    user_id: String(userId),
    bookmark_id: String(bookmarkId),
    rating
  })
  return vote
}

/**
 * Upsert / toggle a bookmark vote for a user.
 * Behavior:
 *  - If no existing vote: create one with provided rating.
 *  - If existing vote has different rating: update rating.
 *  - If existing vote has same rating: remove (toggle off).
 * Returns previous rating (1 | -1 | 0), current rating (1 | -1 | null), and removal flag.
 */
export const upsert_toggle_bookmark_vote = async (
  userId: string,
  bookmarkId: string,
  rating: 1 | -1
): Promise<{ previousRating: 1 | -1 | 0; currentRating: 1 | -1 | null; removal: boolean }> => {
  const existing = await BookmarkVoteModel.findOne({ user_id: String(userId), bookmark_id: String(bookmarkId) })
  if (!existing) {
    // Create new vote
    await BookmarkVoteModel.create({ user_id: String(userId), bookmark_id: String(bookmarkId), rating })
    return { previousRating: 0, currentRating: rating, removal: false }
  }
  if (existing.rating === rating) {
    // Toggle off
    await BookmarkVoteModel.deleteOne({ _id: existing._id })
    return { previousRating: rating, currentRating: null, removal: true }
  }
  // Switch rating
  const prev = existing.rating
  existing.rating = rating
  await existing.save()
  return { previousRating: prev, currentRating: rating, removal: false }
}

/** Delete a bookmark vote and return its previous rating or null if not found */
export const delete_bookmark_vote = async (
  userId: string,
  bookmarkId: string
): Promise<1 | -1 | null> => {
  const existing = await BookmarkVoteModel.findOne({ user_id: String(userId), bookmark_id: String(bookmarkId) })
  if (!existing) return null
  const prev = existing.rating
  await BookmarkVoteModel.deleteOne({ _id: existing._id })
  return prev
}

export const read_bookmark_vote_collection = async (
  req: TBookmarkVoteFastifyRequest
): Promise<PaginateResult<IBookmarkVoteDocument>> => {
  const page = Number(req.query.page?.number ?? 1)
  const limit = Number(req.query.page?.size ?? Config.PAGINATION_BOOKMARK_VOTE_LIMIT)
  const result = await BookmarkVotePaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  })

  return result
}