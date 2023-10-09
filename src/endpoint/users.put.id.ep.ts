import { FastifyReply, FastifyRequest } from 'fastify'
import { AnnotationModel } from '../model/annotation'
import { UserModel } from '../model/user'
import JsonapiErrorBuilder from 'src/business.logic/jsonapi.error.builder'

export async function users_vote_put_by_id_endpoint(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { id } = req.params as { id: string }
  const { annotationId, rating } = req.body as { annotationId: string, rating: 1 | -1 }

  try {
    await update_user_vote(id, annotationId, rating)
    reply.code(204).send()
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
async function update_user_vote(userId: string, annotationId: string, rating: 1 | -1) {
  // Find the user document by their ID
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  // Check if the user has already voted on the annotation
  user.votes = user.votes || []
  const voteIndex = user.votes.findIndex(v => v.annotation_id === annotationId);

  if (voteIndex === -1) {
    // If the user has not voted on the annotation, add the annotation ID and the vote to the user's votes array
    user.votes.push({ annotation_id: annotationId, rating })
  } else if (user.votes[voteIndex].rating !== rating) {
    // If the user has already voted on the annotation, check if the new vote is different from the original vote
    // If the new vote is different, update the vote in the user's votes array
    user.votes[voteIndex].rating = rating
  }

  // Save the updated user document
  await user.save()

  // Update the annotation's upvote or downvote count based on the new vote
  const annotation = await AnnotationModel.findById(annotationId);

  if (!annotation) {
    throw new Error('Annotation not found');
  }

  annotation.upvotes = annotation.upvotes || 0
  annotation.downvotes = annotation.downvotes || 0

  if (rating === 1) {
    annotation.upvotes += 1;
    annotation.downvotes -= 1;
  } else if (rating === -1) {
    annotation.upvotes -= 1;
    annotation.downvotes += 1;
  }

  // Save the updated annotation document
  await annotation.save();
}
