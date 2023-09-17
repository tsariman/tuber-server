import mongoose, { Schema } from 'mongoose'
import { IJsonapiQuerystring, WithRequired } from '../../business.logic/common.types'
import { TRole } from 'src/business.logic/security/permissions'
import { FastifyRequest } from 'fastify'
import paginate from 'mongoose-paginate-v2'

export interface IUser {
  is_active?: boolean
  name: string
  email: string
  phone?: string
  role?: TRole
  username?: string
  firstname?: string
  lastname?: string
  gender?: 'male' | 'female'
  password: string
  jwt_version?: number
  avatar?: string
  last_accessed?: Date
  modified_at?: Date
  created_at?: Date
  restrictions?: {[key: string]: string}
  rules?: string[]
}

export interface IUsersEndpoint {
  Body: IUser
  Params: {
    name: string
  }
  Querystring: IJsonapiQuerystring
}

export type TUsersFastifyRequest = FastifyRequest<IUsersEndpoint>

/**
 * Similar to the user interface except some keys which were optional are now
 * required.
 */
export type TUser = WithRequired<IUser,              // { _id: string } & WithRequired<IUser,
  'is_active' | 'jwt_version' | 'created_at' | 'role'
>

export type TCipheredUser = Pick<TUser, 'name' | 'jwt_version' | 'role'>

export interface IUserDocument extends mongoose.Document, TUser {}

const userSchema = new Schema<TUser>({
  is_active: {type: Boolean, default: true },
  name: {type: String, unique: true},
  email: {type: String, unique: true},
  phone: String,
  role: { type: String, default: 'user' },
  username: String,
  firstname: String,
  lastname: String,
  password: { type: String, default: null },
  jwt_version: { type: Number, default: 0 },
  avatar: String,
  last_accessed:  Date,
  modified_at: Date,
  created_at: { type: Date, default: Date.now },
  /**
   * List of permission strings that will be enforced on this document.
   * By default, there is no need for access permissions except in special
   * cases.
   * [PRIORITY - LOW]
   */
  restrictions: Object,
  /**
   * Cron job rules to be applied in special cases. e.g. At a certain date
   * and/or time, the document will automatically be modified via a scheduled
   * task.
   * [PRIORITY - LOW]
   */
  rules: [ String ]
})

userSchema.plugin(paginate)

export default userSchema
