import { Schema } from 'mongoose'
import { TRole } from '../common.types'

export interface IUser {
  active?: boolean
  name: string
  email: string
  phone?: string
  role: TRole
  username?: string
  firstname?: string
  lastname?: string
  password?: string
  avatar?: string
  last_accessed?: Date
  modified?: Date
  created?: Date
  restrictions?: string[]
  rules?: string[]
}

const userSchema = new Schema<IUser>({
  active: {type: Boolean, default: true },
  name: {type: String, unique: true},
  email: {type: String, unique: true},
  phone: String,
  role: String,
  username: String,
  firstname: String,
  lastname: String,
  password: { type: String, default: null },
  avatar: String,
  last_accessed:  Date,
  modified: Date,
  created: { type: Date, default: Date.now },
  /**
   * List of permission strings that will be enforced on this document.
   * By default, there is no need for access permissions except in special
   * cases.
   * [PRIORITY - LOW]
   */
  restrictions: [ String ],
  /**
   * Cron job rules to be applied in special cases. e.g. At a certain date
   * and/or time, the document will automatically be modified via a scheduled
   * task.
   * [PRIORITY - LOW]
   */
  rules: [ String ]
})

export default userSchema
