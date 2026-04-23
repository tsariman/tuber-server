import { FastifyReply, FastifyRequest } from 'fastify'
import { BookmarkModel } from '../../model/bookmark'
import { UserModel } from '../../model/user'
import { delete_bookmark_vote } from '../../model/bookmark.vote'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { errr, ler, log_err, task } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'

interface IBookmarkVoteDelete {
  Params: { id?: string }
}

/** `DELETE /bookmarks/:id/vote` endpoint handler */
export async function delete_bookmark_vote_by_id_endpoint(
  req: FastifyRequest<IBookmarkVoteDelete>,
  reply: FastifyReply
) {
  task('Processing bookmark vote removal ')
  try {
    const { usr, params: { id: bookmarkId } } = req
    // Authenticated user required
    if (!usr?._id) {
      task.end('[❌]')
      errr('Authentication required to remove vote')
      reply.code(401).send(new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle('Unauthorized')
        .withDetail('Authentication required to remove vote')
        .build()
      )
      return
    }
    task.end('[✔️]')
    task('Verifying bookmark existence ')
    if (!bookmarkId) {
      task.end('[❌]')
      errr('Missing bookmark id in vote removal request')
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_DATA')
        .withTitle('Bad Request')
        .withDetail('Missing bookmark id')
        .build()
      )
      return
    }
    task.end('[✔️]')
    task('Verifying bookmark existence in the database ')
    const bookmarkExists = await BookmarkModel.exists({ _id: bookmarkId })
    if (!bookmarkExists) {
      task.end('[❌]')
      errr('Bookmark not found to remove vote')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Bookmark not found')
        .withDetail('Cannot remove vote from a non-existent bookmark')
        .build()
      )
      return
    }
    task.end('[✔️]')
    task('Verifying authenticated user existence in the database ')
    const user = await UserModel.findById(usr._id)
    if (!user) {
      task.end('[❌]')
      errr('Authenticated user not found in database')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('User not found')
        .withDetail('Authenticated user not found')
        .build()
      )
      return
    }
    task.end('[✔️]')
    task('Removing bookmark vote ')
    const previousRating = await delete_bookmark_vote(String(usr._id), String(bookmarkId))
    if (previousRating === null) {
      task.end('[❌]')
      errr('Vote not found to remove')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Vote not found')
        .withDetail('User has not voted on this bookmark')
        .build()
      )
      return
    }
    task.end('[✔️]')
    task('Updating bookmark vote counters ')
    // Decrement appropriate counter atomically
    const inc = previousRating === 1
      ? { upvotes: -1 }
      : { downvotes: -1 }

    const updatedBookmark = await BookmarkModel.findOneAndUpdate(
      { _id: bookmarkId },
      { $inc: inc },
      { new: true, projection: { upvotes: 1, downvotes: 1 } }
    )

    if (!updatedBookmark) {
      task.end('[❌]')
      errr('Failed to update bookmark counters during vote removal')
      reply.code(500).send(new JsonapiErrorBuilder()
        .withStatus(500)
        .withCode('DELETE_FAILED')
        .withTitle('Vote removal failed')
        .withDetail('Bookmark counters not updated during vote removal')
        .build()
      )
      return
    }
    task.end('[✔️]')
    reply.code(200).send({
      data: {
        type: 'bookmark-vote',
        id: String(bookmarkId),
        attributes: {
          upvotes: updatedBookmark.upvotes || 0,
          downvotes: updatedBookmark.downvotes || 0,
          rating: null
        }
      }
    })
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5009]'))
    log_err('[5009] DELETE bookmark vote by id', e)
    reply.code(500).send(error_id(5009).default_500_error_response(e))
  }
}