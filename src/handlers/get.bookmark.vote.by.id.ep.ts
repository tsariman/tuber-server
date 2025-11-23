import { FastifyReply, FastifyRequest } from 'fastify'
import { IBookmarkVoteGet } from '../schema/bookmarks'
import JsonapiErrorBuilder from '../business.logic/builder/JsonapiErrorBuilder'
import { BookmarkModel } from '../model/bookmark'
import { UserModel } from '../model/user'
import { default_500_error_response } from '../business.logic/errors'

/** `GET /bookmarks/:id/vote` */
export async function get_bookmark_vote_by_id_endpoint(
  req: FastifyRequest<IBookmarkVoteGet>,
  reply: FastifyReply
) {
  const { id: bookmarkId } = req.params

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

  try {
    const cUsr = (req as any).usr
    if (!cUsr?._id) {
      reply.code(401).send(new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle('Unauthorized')
        .withDetail('Authentication required to read vote state')
        .build()
      )
      return
    }

    const bookmark = await BookmarkModel.findById(bookmarkId, { upvotes: 1, downvotes: 1 })
    if (!bookmark) {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('RESOURCE_NOT_FOUND')
        .withTitle('Bookmark not found')
        .withDetail('Cannot read vote state for a non-existent bookmark')
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

    const voteIndex = (user.votes || []).findIndex(v => v.bookmark_id === String(bookmarkId))
    const currentRating: 1 | -1 | null = voteIndex === -1 ? null : user.votes![voteIndex].rating as 1 | -1

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
    reply.code(500).send(default_500_error_response(e))
  }
}

export default get_bookmark_vote_by_id_endpoint
