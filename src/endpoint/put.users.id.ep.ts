import { FastifyReply, FastifyRequest } from 'fastify'
import { BookmarkModel } from '../model/bookmark'
import { UserModel } from '../model/user'
import JsonapiErrorBuilder, { default_500_error_response } from '../business.logic/jsonapi.error.builder'
import Config from '../config'
import { MSG_500_ERROR_MESSAGE } from '../constants'

export async function put_users_vote_by_id_endpoint(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = req.params as { userId: string }
  const { bookmarkId, rating } = req.body as { bookmarkId: string, rating: 1 | -1 }

  try {
    const msg = await _update_user_vote(userId, bookmarkId, rating)
    if (msg === 'OK') {
      reply.code(204).send()
    } else if (msg === 'User not found') {
      reply.code(404).send(new JsonapiErrorBuilder()
        .code('not_found')
        .status(404)
        .title('User not found')
        .detail('The user you are trying to vote as does not exist.')
        .build()
      )
    } else if (msg === 'User has already voted on this bookmark') {
      reply.code(409).send(new JsonapiErrorBuilder()
        .code('conflict')
        .status(409)
        .title('User has already voted on this bookmark')
        .detail('The user you are trying to vote as has already voted on this bookmark.')
        .build()
      )
    } else if (msg === 'Bookmark not found') {
      reply.code(404).send(new JsonapiErrorBuilder()
        .code('not_found')
        .status(404)
        .title('Bookmark not found')
        .detail('The bookmark you are trying to vote on does not exist.')
        .build()
      )
    }
  } catch (e: any) {
    Config.log(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }

}

/**  */
async function _update_user_vote(
  userId: string,
  bookmarkId: string,
  rating: 1 | -1
): Promise<'Bookmark not found'
  | 'User not found'
  | 'User has already voted on this bookmark'
  | 'OK'
> {
  // Find the user document by their ID
  const user = await UserModel.findById(userId)

  if (!user) {
    return 'User not found'
  }

  // Check if the user has already voted on the bookmark
  user.votes = user.votes || []
  const voteIndex = user.votes.findIndex(v => v.bookmark_id === bookmarkId)

  if (voteIndex === -1) {
    // If the user has not voted on the bookmark, add the bookmark ID and the vote to the user's votes array
    user.votes.push({ bookmark_id: bookmarkId, rating })
  } else if (user.votes[voteIndex].rating !== rating) {
    // If the user has already voted on the bookmark, check if the new vote is different from the original vote
    // If the new vote is different, update the vote in the user's votes array
    user.votes[voteIndex].rating = rating
  } else {
    return 'User has already voted on this bookmark'
  }

  // Save the updated user document
  await user.save()

  // Update the bookmark's upvote or downvote count based on the new vote
  const bookmark = await BookmarkModel.findById(bookmarkId);

  if (!bookmark) {
    return 'Bookmark not found'
  }

  bookmark.upvotes = bookmark.upvotes || 0
  bookmark.downvotes = bookmark.downvotes || 0

  if (rating === 1) {
    bookmark.upvotes += 1
    bookmark.downvotes -= 1
  } else if (rating === -1) {
    bookmark.upvotes -= 1
    bookmark.downvotes += 1
  }

  // Save the updated bookmark document
  await bookmark.save()

  return 'OK'
}
