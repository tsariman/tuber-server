import { FastifyReply, FastifyRequest } from 'fastify'
import { IBookmarkVotePut } from '../../schema/bookmark'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import { assure } from '../../utility'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { BookmarkModel } from '../../model/bookmark'
import { UserModel } from '../../model/user'
import { upsert_toggle_bookmark_vote } from '../../model/bookmark.vote'
import { default_500_error_response } from '../../business.logic/errors'
import { log_err } from '../../utility/logging'

interface IBookmarkVoteUpdate {
  upvotes?: number
  downvotes?: number
}

type TBookmarkVoteUpdateDoc = IBookmarkVoteUpdate | null

/** `PUT /bookmarks/:id/vote` endpoint handler */
export async function put_bookmark_vote_by_id_endpoint(
  req: FastifyRequest<IBookmarkVotePut>,
  reply: FastifyReply
) {
  const { id: bookmarkId } = req.params
  const driver = new JsonapiRequestDriver(req.body)
  const { rating } = assure(driver.getAttributes())

  if (!bookmarkId || !rating) {
    reply.code(400).send(new JsonapiErrorBuilder()
      .withStatus(400)
      .withCode('MISSING_VALUE')
      .withTitle('Bad Request')
      .withDetail('Missing bookmark id or rating')
      .build()
    )
    return
  }

  try {
    // Authenticated user (from preHandler cache); fallback not allowed
    const cUsr = (req as any).usr
    if (!cUsr?._id) {
      reply.code(401).send(new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle('Unauthorized')
        .withDetail('Authentication required to vote')
        .build()
      )
      return
    }

    const user = await UserModel.findById(cUsr._id)
    if (!user) {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('RESOURCE_NOT_FOUND')
        .withTitle('User not found')
        .withDetail('Authenticated user not found')
        .build()
      )
      return
    }

    const bookmarkExists = await BookmarkModel.exists({ _id: bookmarkId })
    if (!bookmarkExists) {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('RESOURCE_NOT_FOUND')
        .withTitle('Bookmark not found')
        .withDetail('The bookmark you are trying to vote on does not exist')
        .build()
      )
      return
    }

    // New collection based vote logic (user.votes array retained for legacy data only)
    const { previousRating, currentRating: toggledRating, removal } = await upsert_toggle_bookmark_vote(String(cUsr._id), String(bookmarkId), rating)

    const inc: Record<string, number> = {}
    if (removal) {
      // Decrement the counter corresponding to the removed vote
      if (previousRating === 1) inc.upvotes = -1
      else if (previousRating === -1) inc.downvotes = -1
    } else if (previousRating === 0) {
      // New vote
      if (rating === 1) inc.upvotes = 1
      else inc.downvotes = 1
    } else if (previousRating === 1 && rating === -1) {
      // Switch from upvote to downvote
      inc.upvotes = -1; inc.downvotes = 1
    } else if (previousRating === -1 && rating === 1) {
      // Switch from downvote to upvote
      inc.downvotes = -1; inc.upvotes = 1
    }

    // Apply atomic increments and fetch updated counts
    let updatedBookmark: TBookmarkVoteUpdateDoc = null
    if (Object.keys(inc).length) {
      updatedBookmark = await BookmarkModel.findOneAndUpdate(
        { _id: bookmarkId },
        { $inc: inc },
        { new: true, projection: { upvotes: 1, downvotes: 1 } }
      ) as TBookmarkVoteUpdateDoc
    } else {
      // No counter change (should only happen if logic missed a branch)
      updatedBookmark = await BookmarkModel.findById(bookmarkId, { upvotes: 1, downvotes: 1 }) as TBookmarkVoteUpdateDoc
    }

    if (updatedBookmark) {
      const finalRating: 1 | -1 | null = removal ? null : toggledRating
      reply.code(200).send({
        data: {
          type: 'bookmark-vote',
          id: String(bookmarkId),
          attributes: {
            upvotes: updatedBookmark.upvotes || 0,
            downvotes: updatedBookmark.downvotes || 0,
            rating: finalRating
          }
        }
      })
      return
      // This should never happen: update path completed but updatedBookmark is null.
      // Provide a descriptive error message to aid debugging and monitoring.
      // throw new Error('Vote update failed: updated bookmark document not retrieved after atomic increment.')
    } else {
      log_err('Vote update invariant failed', {
        bookmarkId,
        userId: cUsr._id,
        previousRating,
        attemptedInc: inc,
      })
      reply.code(500).send(new JsonapiErrorBuilder()
        .withStatus(500)
        .withCode('RESOURCE_UPDATE_FAILED')
        .withTitle('Vote update failed')
        .withDetail('Bookmark counters not retrieved after update.')
        .withMeta('bookmarkId', bookmarkId)
        .build()
      )
      return
    }
  } catch (e) {
    reply.code(500).send(default_500_error_response(e))
  }
}