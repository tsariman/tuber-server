import { FastifyReply, FastifyRequest } from 'fastify'
import { BookmarkModel } from '../../model/bookmark'
import { BookmarkVoteModel } from '../../model/bookmark.vote'
import { UserModel } from '../../model/user'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../../business.logic/errors'
import { ler, log_err } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { IUsersVoteEndpoint } from '../../schema/user'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import { assure } from '../../utility'

/** @deprecated */
export async function put_user_vote_by_id_endpoint(
  req: FastifyRequest<IUsersVoteEndpoint>,
  reply: FastifyReply
) {
  const { userId } = req.params
  const driver = new JsonapiRequestDriver(req.body)
  const { bookmarkId, rating } = assure(driver.getAttributes())
  try {
    const msg = await _update_user_vote(userId, bookmarkId, rating)
    if (msg === 'OK') {
      reply.code(204).send()
    } else if (msg === 'User not found') {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withCode('NOT_FOUND')
        .withStatus(404)
        .withTitle('User not found')
        .withDetail('The user you are trying to vote as does not exist.')
        .build()
      )
    } else if (msg === 'User has already voted on this bookmark') {
      reply.code(409).send(new JsonapiErrorBuilder()
        .withCode('DUPLICATE_RESOURCE')
        .withStatus(409)
        .withTitle('User has already voted on this bookmark')
        .withDetail('The user you are trying to vote as has already voted on this bookmark.')
        .build()
      )
    } else if (msg === 'Bookmark or rating not found') {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withCode('NOT_FOUND')
        .withStatus(404)
        .withTitle('Bookmark not found')
        .withDetail('The bookmark you are trying to vote on does not exist.')
        .build()
      )
    }
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE)
    log_err('PUT user vote by id', e)
    reply.code(500).send(default_500_error_response(e))
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
    return 'Bookmark or rating not found'
  }

  // Find the user document by their ID
  const user = await UserModel.findById(userId)

  if (!user) {
    return 'User not found'
  }

  // Collection-based vote upsert/toggle replaces legacy array persistence
  const existingVote = await BookmarkVoteModel.findOne({ user_id: String(user._id), bookmark_id: String(bookmarkId) })
  let previousRating: 1 | -1 | 0 = 0
  if (!existingVote) {
    await BookmarkVoteModel.create({ user_id: String(user._id), bookmark_id: String(bookmarkId), rating })
  } else if (existingVote.rating === rating) {
    return 'User has already voted on this bookmark'
  } else {
    previousRating = existingVote.rating as 1 | -1
    existingVote.rating = rating
    await existingVote.save()
  }

  // Atomic update on bookmark counters using $inc
  const bookmarkExists = await BookmarkModel.exists({ _id: bookmarkId })
  if (!bookmarkExists) {
    return 'Bookmark or rating not found'
  }
  const inc: Record<string, number> = {}
  if (!existingVote) {
    // New vote
    if (rating === 1) inc.upvotes = 1; else inc.downvotes = 1
  } else if (previousRating === 1 && rating === -1) {
    inc.upvotes = -1; inc.downvotes = 1
  } else if (previousRating === -1 && rating === 1) {
    inc.downvotes = -1; inc.upvotes = 1
  }
  if (Object.keys(inc).length > 0) {
    await BookmarkModel.updateOne({ _id: bookmarkId }, { $inc: inc })
  }
  return 'OK'
}