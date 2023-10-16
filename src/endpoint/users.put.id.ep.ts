import { FastifyReply, FastifyRequest } from 'fastify'
import { AnnotationModel } from '../model/annotation'
import { UserModel } from '../model/user'
import JsonapiErrorBuilder from '../business.logic/jsonapi.error.builder'

export async function users_vote_put_by_id_endpoint(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { userId } = req.params as { userId: string }
  const { annotationId, rating } = req.body as { annotationId: string, rating: 1 | -1 }

  try {
    const msg = await _update_user_vote(userId, annotationId, rating)
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
    } else if (msg === 'User has already voted on this annotation') {
      reply.code(409).send(new JsonapiErrorBuilder()
        .code('conflict')
        .status(409)
        .title('User has already voted on this annotation')
        .detail('The user you are trying to vote as has already voted on this annotation.')
        .build()
      )
    } else if (msg === 'Annotation not found') {
      reply.code(404).send(new JsonapiErrorBuilder()
        .code('not_found')
        .status(404)
        .title('Annotation not found')
        .detail('The annotation you are trying to vote on does not exist.')
        .build()
      )
    }
  } catch (e: any) {
    reply.code(500).send(new JsonapiErrorBuilder()
      .code('internal_server_error')
      .status(500)
      .title(e.message)
      .detail(e.stack)
      .build()
    )
  }

}

/**  */
async function _update_user_vote(
  userId: string,
  annotationId: string,
  rating: 1 | -1
): Promise<'Annotation not found'
  | 'User not found'
  | 'User has already voted on this annotation'
  | 'OK'
> {
  // Find the user document by their ID
  const user = await UserModel.findById(userId)

  if (!user) {
    return 'User not found'
  }

  // Check if the user has already voted on the annotation
  user.votes = user.votes || []
  const voteIndex = user.votes.findIndex(v => v.annotation_id === annotationId)

  if (voteIndex === -1) {
    // If the user has not voted on the annotation, add the annotation ID and the vote to the user's votes array
    user.votes.push({ annotation_id: annotationId, rating })
  } else if (user.votes[voteIndex].rating !== rating) {
    // If the user has already voted on the annotation, check if the new vote is different from the original vote
    // If the new vote is different, update the vote in the user's votes array
    user.votes[voteIndex].rating = rating
  } else {
    return 'User has already voted on this annotation'
  }

  // Save the updated user document
  await user.save()

  // Update the annotation's upvote or downvote count based on the new vote
  const annotation = await AnnotationModel.findById(annotationId);

  if (!annotation) {
    return 'Annotation not found'
  }

  annotation.upvotes = annotation.upvotes || 0
  annotation.downvotes = annotation.downvotes || 0

  if (rating === 1) {
    annotation.upvotes += 1
    annotation.downvotes -= 1
  } else if (rating === -1) {
    annotation.upvotes -= 1
    annotation.downvotes += 1
  }

  // Save the updated annotation document
  await annotation.save()

  return 'OK'
}
