import { FastifyReply, FastifyRequest } from 'fastify';
import { BookmarkModel } from '../model/bookmark';
import { UserModel } from '../model/user';
import JsonapiErrorBuilder from '../business.logic/builder/JsonapiErrorBuilder';
import { default_500_error_response } from '../business.logic/errors'
import { ler, log_err } from '../utility/logging';
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared';

interface ICreateUser {
  Params: { userId?: string };
  Body: {
    bookmarkId?: string;
    rating?: 1 | -1;
  };
}


export async function put_users_vote_by_id_endpoint(
  req: FastifyRequest<ICreateUser>,
  reply: FastifyReply
) {
  const { userId } = req.params;
  const { bookmarkId, rating } = req.body;

  try {
    const msg = await _update_user_vote(userId, bookmarkId, rating);
    if (msg === 'OK') {
      reply.code(204).send();
    } else if (msg === 'User not found') {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withCode('RESOURCE_NOT_FOUND')
        .withStatus(404)
        .withTitle('User not found')
        .withDetail('The user you are trying to vote as does not exist.')
        .build()
      );
    } else if (msg === 'User has already voted on this bookmark') {
      reply.code(409).send(new JsonapiErrorBuilder()
        .withCode('DUPLICATE_RESOURCE')
        .withStatus(409)
        .withTitle('User has already voted on this bookmark')
        .withDetail('The user you are trying to vote as has already voted on this bookmark.')
        .build()
      );
    } else if (msg === 'Bookmark or rating not found') {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withCode('RESOURCE_NOT_FOUND')
        .withStatus(404)
        .withTitle('Bookmark not found')
        .withDetail('The bookmark you are trying to vote on does not exist.')
        .build()
      );
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE);
    log_err('PUT user vote by id', e);
    reply.code(500).send(default_500_error_response(e));
  }

}

/**  */
async function _update_user_vote(
  userId?: string,
  bookmarkId?: string,
  rating?: 1 | -1
): Promise<'Bookmark or rating not found'
  | 'User not found'
  | 'User has already voted on this bookmark'
  | 'OK'
> {
  if (!bookmarkId || !rating) {
    return 'Bookmark or rating not found';
  }

  // Find the user document by their ID
  const user = await UserModel.findById(userId);

  if (!user) {
    return 'User not found';
  }

  // Check if the user has already voted on the bookmark
  user.votes = user.votes || [];
  const voteIndex = user.votes.findIndex(v => v.bookmark_id === bookmarkId);

  if (voteIndex === -1) {
    // If the user has not voted on the bookmark, add the bookmark ID and the vote to the user's votes array
    user.votes.push({ bookmark_id: bookmarkId, rating });
  } else if (user.votes[voteIndex].rating !== rating) {
    // If the user has already voted on the bookmark, check if the new vote is different from the original vote
    // If the new vote is different, update the vote in the user's votes array
    user.votes[voteIndex].rating = rating;
  } else {
    return 'User has already voted on this bookmark';
  }

  // Save the updated user document
  await user.save();

  // Update the bookmark's upvote or downvote count based on the new vote
  const bookmark = await BookmarkModel.findById(bookmarkId);

  if (!bookmark) {
    return 'Bookmark or rating not found';
  }

  bookmark.upvotes = bookmark.upvotes || 0;
  bookmark.downvotes = bookmark.downvotes || 0;

  if (rating === 1) {
    bookmark.upvotes += 1;
    bookmark.downvotes -= 1;
  } else if (rating === -1) {
    bookmark.upvotes -= 1;
    bookmark.downvotes += 1;
  }

  // Save the updated bookmark document
  await bookmark.save();

  return 'OK';
}
