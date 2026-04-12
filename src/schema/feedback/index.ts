import mongoose from 'mongoose'
import { TJsonapiRequest } from '@tuber/shared'

export type TFeedbackCategory = 'Report Bug' | 'Suggestion'

export interface IFeedback {
  is_active?: boolean
  created_at?: Date
  modified_at?: Date
  user_id?: string
  category: TFeedbackCategory
  details: string
  serialized_state: string
}

export interface IFeedbackPost {
  Body: TJsonapiRequest<IFeedback>
}

export type TFeedback = IFeedback & {
  is_active: boolean
  created_at: Date
}

export interface IFeedbackDocument<T = unknown>
  extends mongoose.Document<T>, TFeedback {}

const feedbackSchema = new mongoose.Schema<IFeedbackDocument>(
  {
    is_active: { type: Boolean, default: true },
    created_at: { type: Date, default: Date.now },
    modified_at: Date,
    user_id: String,
    category: {
      type: String,
      enum: ['Report Bug', 'Suggestion'],
      required: true,
    },
    details: { type: String, required: true },
    serialized_state: { type: String, required: true }
  },
  { versionKey: false }
)

feedbackSchema.index({ created_at: -1 })

export default feedbackSchema
