import { IBookmarkDocument } from '../schema/bookmark';
import { IUserDocument } from '../schema/user';

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
export const save_user_vote = async function (
  user: IUserDocument,
  bookmark: IBookmarkDocument,
  vote: 'upvotes' | 'downvotes'
): Promise<IUserDocument> {
  user.votes = user.votes ?? [];
  // Check if user has already voted on this bookmark
  const existingVote = user.votes.find(v => v.bookmark_id === String(bookmark._id));
  if (existingVote) {
    // If the user has already voted on this bookmark, then update the vote
    // rating
    existingVote.rating = vote === 'upvotes' ? 1 : -1;
    const dbUser = await user.save();
    return dbUser;
  }
  user.votes.push({
    bookmark_id: String(bookmark._id),
    rating: vote === 'upvotes' ? 1 : -1
  });
  const dbUser = await user.save();
  return dbUser;
}
