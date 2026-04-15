import { FastifyReply, FastifyRequest } from 'fastify'
import { IBookmarkVoteGet } from '../../schema/bookmark'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { BookmarkModel } from '../../model/bookmark'
import { BookmarkVoteModel } from '../../model/bookmark.vote'
import { error_id } from '../../business.logic/errors'
import { errr, ler, log_err, task } from '../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'

/** `GET /bookmarks/:id/vote` endpoint handler */
export async function get_bookmark_vote_by_id_endpoint(
  req: FastifyRequest<IBookmarkVoteGet>,
  reply: FastifyReply
) {
  task('Reading bookmark vote state ')
  try {
    const { id: bookmarkId } = req.params
    if (!bookmarkId) {
      task.end('[❌]')
      errr('Missing bookmark id in vote state request')
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
    task('Verifying authenticated user ')
    // Authenticated user (from preHandler cache); fallback not allowed
    const cUsr = req.usr
    if (!cUsr?._id) {
      task.end('[❌]')
      errr('Authentication required to read vote state')
      reply.code(401).send(new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle('Unauthorized')
        .withDetail('Authentication required to read vote state')
        .build()
      )
      return
    }
    task.end('[✔️]')
    task('Verifying bookmark existence ')
    const bookmark = await BookmarkModel.findById(bookmarkId, { upvotes: 1, downvotes: 1 })
    if (!bookmark) {
      task.end('[❌]')
      errr('Bookmark not found to read vote state')
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Bookmark not found')
        .withDetail('Cannot read vote state for a non-existent bookmark')
        .build()
      )
      return
    }
    task.end('[✔️]')
    const voteDoc = await BookmarkVoteModel.findOne({ user_id: String(cUsr._id), bookmark_id: String(bookmarkId) }, { rating: 1 })
    const currentRating: 1 | -1 | null = voteDoc ? (voteDoc.rating as 1 | -1) : null
    reply.code(200).send({
      data: {
        type: 'bookmark-vote',
        id: String(bookmarkId),
        attributes: {
          upvotes: bookmark.upvotes || 0,
          downvotes: bookmark.downvotes || 0,
          rating: currentRating
        }
      }
    })
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50012]'))
    log_err('[50012] GET bookmark vote by id error', e)
    reply.code(500).send(error_id(50012).default_500_error_response(e))
  }
}

export default get_bookmark_vote_by_id_endpoint
