import { FastifyPluginAsync } from 'fastify'
import { PUBLIC_ROUTE_OPTIONS } from '../../middleware/router.option'
import post_feedback_endpoint from './post.feedback.ep'
import { IFeedbackPost } from '../../schema/feedback'

const feedbacks: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {
  const $public = { ...rootOpts, ...PUBLIC_ROUTE_OPTIONS }

  // POST /feedbacks
  fastify.post<IFeedbackPost>('/', $public, post_feedback_endpoint)
}

export default feedbacks
