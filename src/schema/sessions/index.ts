import { Schema } from 'mongoose'
import userSchema, { IUser } from '../users'

export interface ISession {
  active?: boolean
  created_at: Date
  modified_at?: Date
  // When the session expires, it needs to be deleted.
  expiration_date: number
  /** The session token. */
  token: string
  // User that created the session. If the user updates his information
  // with a session active, this field needs to be updated also.
  user: IUser
}

const sessionSchema = new Schema<ISession>({
  active: { type: Boolean, default: true },
  created_at: { type: Date, default: Date.now },
  modified_at: Date,
  expiration_date: Number,
  token: String,
  user: userSchema
})

export default sessionSchema