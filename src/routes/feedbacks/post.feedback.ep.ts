import { FastifyReply, FastifyRequest } from 'fastify'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { create_feedback, transform_to_feedback } from '../../model/feedback'
import { IFeedback, IFeedbackPost } from '../../schema/feedback'
import { error_id } from '../../business.logic/errors'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { ler, log_err } from '../../utility/logging'

export default async function post_feedback_endpoint (
  req: FastifyRequest<IFeedbackPost>,
  reply: FastifyReply
) {
  try {
    const driver = new JsonapiRequestDriver(req.body)
    const attrs = driver.getAttributes() as Partial<IFeedback> | undefined

    if (!attrs) {
      reply.code(400).send(
        new JsonapiErrorBuilder()
          .withStatus(400)
          .withCode('MALFORMED_REQUEST')
          .withTitle('The request format is invalid')
          .build()
      )
      return
    }

    if (attrs.category !== 'Report Bug' && attrs.category !== 'Suggestion') {
      reply.code(400).send(
        new JsonapiErrorBuilder()
          .withStatus(400)
          .withCode('MISSING_DATA')
          .withTitle('Feedback category is required')
          .build()
      )
      return
    }

    const details = (attrs.details ?? '').trim()
    const serializedState = (attrs.serialized_state ?? '').trim()

    if (!details || !serializedState) {
      reply.code(400).send(
        new JsonapiErrorBuilder()
          .withStatus(400)
          .withCode('MISSING_DATA')
          .withTitle('Details and serialized state are required')
          .build()
      )
      return
    }

    const dbFeedback = await create_feedback({
      category: attrs.category,
      details,
      serialized_state: serializedState,
      user_id: req.usr?._id,
      modified_at: new Date()
    })

    const response = JsonapiResponseBuilder
      .forSingleResource(transform_to_feedback(dbFeedback), 'feedbacks')
      .withId(dbFeedback._id)
      .build()

    reply.code(201).send(response)
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5090]'))
    log_err('[5090] POST feedback', e)
    reply.code(500).send(error_id(5090).default_500_error_response(e))
  }
}
