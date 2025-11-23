import { FastifyReply, FastifyRequest } from 'fastify'
import { BookmarkModel } from '../model/bookmark'
import { UserModel } from '../model/user'
import JsonapiErrorBuilder from '../business.logic/builder/JsonapiErrorBuilder'
import { default_500_error_response } from '../business.logic/errors'

interface IBookmarkVoteDelete {
  Params: { id?: string }
}

/** `DELETE /bookmarks/:id/vote` */
export async function delete_bookmark_vote_by_id_endpoint(
  req: FastifyRequest<IBookmarkVoteDelete>,
  reply: FastifyReply
) {
  const { id: bookmarkId } = req.params

  try {
    // Authenticated user required
    const cUsr = (req as any).usr
    if (!cUsr?._id) {
      reply.code(401).send(new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle('Unauthorized')
        .withDetail('Authentication required to remove vote')
        .build()
      )
      return
    }

    if (!bookmarkId) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MISSING_VALUE')
        .withTitle('Bad Request')
        .withDetail('Missing bookmark id')
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
        .withDetail('Cannot remove vote from a non-existent bookmark')
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

    user.votes = user.votes || []
    const voteIndex = user.votes.findIndex(v => v.bookmark_id === String(bookmarkId))
    if (voteIndex === -1) {
      // No vote to remove
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('RESOURCE_NOT_FOUND')
        .withTitle('Vote not found')
        .withDetail('User has not voted on this bookmark')
        .build()
      )
      return
    }

    const previousRating = user.votes[voteIndex].rating as 1 | -1
    // Remove vote record
    user.votes.splice(voteIndex, 1)
    await user.save()

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
      reply.code(500).send(new JsonapiErrorBuilder()
        .withStatus(500)
        .withCode('VOTE_UPDATE_FAILED')
        .withTitle('Vote removal failed')
        .withDetail('Bookmark counters not updated during vote removal')
        .build()
      )
      return
    }

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
    reply.code(500).send(default_500_error_response(e))
  }
}