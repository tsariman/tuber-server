import { model } from 'mongoose'
import feedbackSchema, {
  IFeedback,
  IFeedbackDocument,
  TFeedback
} from '../../schema/feedback'

export const FeedbackModel = model<TFeedback>('feedbacks', feedbackSchema)

export const create_feedback = async function (
  feedbackData: IFeedback
): Promise<IFeedbackDocument> {
  const feedback = await FeedbackModel.create(feedbackData)
  return feedback
}

export const transform_to_feedback = (
  feedbackDoc: IFeedbackDocument
): IFeedback => {
  const { _id, is_active, ...feedback } = feedbackDoc.toObject<IFeedback>()
  return feedback
}
