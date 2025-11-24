import { IBookmarkDocument } from '../schema/bookmark';
import { IUserDocument } from '../schema/user';
import { upsert_toggle_bookmark_vote } from './bookmark.vote';

/**
 * Increment the vote count of a bookmark. Use this function when a user decides
 * to vote on a bookmark.
 * @param bookmark The bookmark to increment the vote count of
 * @param vote The vote to increment
 * @returns The bookmark document
 */
export const increment_bookmark_vote_count = async function (
  bookmark: IBookmarkDocument,
  vote: 'upvotes' | 'downvotes'
): Promise<IBookmarkDocument> {
  bookmark[vote] = (bookmark[vote] || 0) + 1;
  const dbBookmark = await bookmark.save();
  return dbBookmark;
}

/**
 * Decrement the vote count of a bookmark. To be used with a user decides to
 * remove their vote.
 * @param bookmark The bookmark to decrement the vote count of
 * @param vote The vote to decrement
 * @returns The bookmark document
 */
export const decrement_bookmark_vote_count = async function (
  bookmark: IBookmarkDocument,
  vote: 'upvotes' | 'downvotes'
): Promise<IBookmarkDocument> {
  bookmark[vote] = (bookmark[vote] || 0) - 1;
  const dbBookmark = await bookmark.save();
  return dbBookmark;
}

/**
 * Save the user vote on a bookmark. This function is use in the endpoint where
 * a user votes on a bookmark.
 * @param user The user to save the vote for
 * @param bookmark The bookmark to save the vote for
 * @param vote The vote to save
 * @returns The user document
 */
/**
 * @deprecated Legacy array-based user vote persistence. Use upsert_toggle_bookmark_vote instead.
 * Provided for backward compatibility; writes to user.votes are no longer required.
 */
export const save_user_vote = async function (
  user: IUserDocument,
  bookmark: IBookmarkDocument,
  vote: 'upvotes' | 'downvotes'
): Promise<IUserDocument> {
  const rating = vote === 'upvotes' ? 1 : -1;
  await upsert_toggle_bookmark_vote(String(user._id), String(bookmark._id), rating);
  return user; // user document unchanged (legacy field not maintained)
}
