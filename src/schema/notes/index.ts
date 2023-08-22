import { Schema } from 'mongoose'

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
  endSeconds: number
  title: string
  note: string
  restrictions?: string[]
  rules?: string[]
}

const noteSchema = new Schema<INote>({
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
  note: String,
  restrictions: [ String ],
  rules: [ String ]
})

export default noteSchema