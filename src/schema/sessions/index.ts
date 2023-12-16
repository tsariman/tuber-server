import mongoose, { Schema } from 'mongoose'
import userSchema, { IUserDocument } from '../users'

export interface ISession {
  is_active?: boolean
  created_at?: Date
  modified_at?: Date
  // When the session expires, it needs to be deleted.
  expiration_date: Date
  /** The session token. */
  token: string
  // User that created the session. If the user updates his information
  // with a session active, this field needs to be updated also.
  user: IUserDocument
  ip?: string
  restrict?: Record<string, string>
  rules?: Record<string, string>
}

export interface ISessionDocument extends mongoose.Document, ISession {}

const sessionSchema = new Schema<ISessionDocument>({
  is_active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
  expiration_date: Date,
  token: String,
  user: userSchema,
  ip: String,
  restrict: { type: Map, of: String, default: undefined },
  rules: { type: Map, of: String, default: undefined }
})

sessionSchema.index({ token: 1 })

export default sessionSchema