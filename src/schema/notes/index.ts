import { FastifyRequest } from 'fastify'
import mongoose, { Schema } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { WithRequired } from 'src/utility/common.types'

export interface INote {
  active?: boolean
  created_at?: Date
  modified_at?: Date
  private?: boolean
  user_id?: string
  group?: string
  videoid: string
  platform: string
  startSeconds: number
  endSeconds?: number
  title: string
  detail?: string
  restrictions?: string[]
  rules?: string[]
}

export interface INotesEndpoint {
  Body: INote
  Params: {
    id: string
  }
}

export type TNotesFastifyRequest = FastifyRequest<INotesEndpoint>

export type TNote = WithRequired<INote,
  'active' | 'created_at' | 'modified_at' | 'private' | 'user_id'
>

export interface INoteDocument extends mongoose.Document, TNote {}

const noteSchema = new Schema<TNote>({
  active: { type: Boolean, default: true },
  private: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
  user_id: String,
  group: String,
  videoid: String,
  platform: String,
  startSeconds: Number,
  endSeconds: Number,
  title: String,
  detail: String,
  restrictions: [ String ],
  rules: [ String ]
})

noteSchema.plugin(paginate)

export default noteSchema