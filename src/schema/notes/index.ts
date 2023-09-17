import { FastifyRequest } from 'fastify'
import mongoose, { Schema } from 'mongoose'
import paginate from 'mongoose-paginate-v2'
import { IJsonapiQuerystring, WithRequired } from 'src/business.logic/common.types'

export interface INote {
  is_active?: boolean
  created_at?: Date
  modified_at?: Date
  is_private?: boolean
  user_id?: string
  group?: string
  videoid: string
  platform: string
  start_seconds: number
  end_seconds?: number
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
  Querystring: IJsonapiQuerystring
}

export type TNotesFastifyRequest = FastifyRequest<INotesEndpoint>

export type TNote = WithRequired<INote,
  'is_active' | 'created_at' | 'modified_at' | 'is_private' | 'user_id'
>

export interface INoteDocument extends mongoose.Document, TNote {}

const noteSchema = new Schema<TNote>({
  is_active: { type: Boolean, default: true },
  is_private: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
  user_id: String,
  group: String,
  videoid: String,
  platform: String,
  start_seconds: Number,
  end_seconds: Number,
  title: String,
  detail: String,
  restrictions: [ String ],
  rules: [ String ]
})

noteSchema.plugin(paginate)

export default noteSchema