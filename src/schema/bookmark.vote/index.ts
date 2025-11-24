import { TJsonapiQueryParams } from '@tuber/shared'
import { FastifyRequest } from 'fastify'
import mongoose, { Schema } from 'mongoose'
import paginate from 'mongoose-paginate-v2'

export interface IBookmarkVote {
  is_active: boolean
  user_id: string
  bookmark_id: string
  /** 1 = upvote, -1 = downvote */
  rating: 1 | -1
  created_at: Date
  modified_at?: Date
}

export interface IBookmarkVoteEndpoint {
  Querystring: TJsonapiQueryParams
  Params: { id?: string }
  Body: {
    data: {
      type: string
      attributes: {
        rating?: 1 | -1
      }
    }
  }
}

export type TBookmarkVoteFastifyRequest = FastifyRequest<IBookmarkVoteEndpoint>

export interface IBookmarkVoteDocument extends mongoose.Document<string>, IBookmarkVote {}

const bookmarkVoteSchema = new Schema<IBookmarkVoteDocument>({
  is_active: {type: Boolean, default: true },
  user_id: { type: String, required: true },
  bookmark_id: { type: String, required: true },
  rating: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
}, { versionKey: false })

// Ensure one vote per user per bookmark.
bookmarkVoteSchema.index({ user_id: 1, bookmark_id: 1 }, { unique: true })

bookmarkVoteSchema.plugin(paginate)

export default bookmarkVoteSchema