import mongoose, { Schema } from 'mongoose'
import { TRole, WithRequired } from '../../common.types'
import { FastifyRequest } from 'fastify'
import paginate from 'mongoose-paginate-v2'
import { TJsonapiQueryParams } from '@tuber/shared'

export interface IUser {
  is_active?: boolean
  /** Username */
  name: string
  email: string
  email_verified?: boolean
  email_verification_code?: string
  email_verification_code_expires?: Date
  email_verified_at?: Date
  password_reset_token?: string
  password_reset_expires?: Date
  email_2?: string
  email_3?: string
  phone?: string
  password?: string
  role?: TRole
  /** Patreon user id linked to this account. */
  patreon_user_id?: string
  /** Patreon membership id linked to this account. */
  patreon_membership_id?: string
  /** Last known Patreon subscription status. */
  patreon_subscription_status?: 'active' | 'inactive'
  /** Last Patreon webhook event processed for this user. */
  patreon_last_event?: string
  /** Optional provenance for supporter role automation. */
  supporter_source?: 'patreon'
  username?: string
  firstname?: string
  lastname?: string
  gender?: 'male' | 'female'
  /** Date of birth */
  dob?: Date
  jwt_version?: number
  avatar?: string
  votes?: {
    is_active: boolean
    bookmark_id: string
    /** 1 = upvote, -1 = downvote */
    rating: 1 | -1
    created_at: Date
    modified_at?: Date
  }[]
  last_signin_at?: Date
  modified_at?: Date
  created_at?: Date
  restrictions?: Record<string, string>
  rules?: Record<string, string>
}

export type TUserParams = {
  name: string
  id: string
}

export interface IUsersEndpoint<K extends keyof TUserParams = keyof TUserParams> {
  Body: {
    data: {
      type: string
      attributes: IUser
    }
  }
  Params: Pick<TUserParams, K>
  Querystring: TJsonapiQueryParams
}

/** @deprecated */
export interface IUsersVoteEndpoint {
  Params: { userId?: string }
  Body: {
    data: {
      type: string
      attributes: {
        bookmarkId?: string
        rating?: 1 | -1
      }
    }
  }
}

export type TUsersFastifyRequest<K extends keyof TUserParams = keyof TUserParams> = FastifyRequest<IUsersEndpoint<K>>

/**
 * Similar to the user interface except some keys which were optional are now
 * required since the schema gives them a default value.
 */
export type TUser = WithRequired<IUser,
  'is_active' | 'jwt_version' | 'created_at' | 'role'
>

export interface IUserDocument extends TUser, mongoose.Document<string> {}

/** User object decoded from JWT token */
export type TContextualUser = Pick<IUserDocument, '_id' | 'name' | 'jwt_version' | 'role' | 'email_verified'>
export type TUsr = TContextualUser | null

const userSchema = new Schema<IUserDocument>({
  is_active: {type: Boolean, default: true },
  name: {type: String, unique: true, trim: true, lowercase: true},
  email: {type: String, unique: true, trim: true, lowercase: true},
  email_verified: { type: Boolean, default: false },
  email_verification_code: String,
  email_verification_code_expires: Date,
  email_verified_at: Date,
  password_reset_token: String,
  password_reset_expires: Date,
  email_2: String,
  email_3: String,
  phone: String,
  password: { type: String, default: null },
  role: { type: String, default: 'free' },
  patreon_user_id: { type: String, default: undefined },
  patreon_membership_id: { type: String, default: undefined },
  patreon_subscription_status: { type: String, default: undefined },
  patreon_last_event: { type: String, default: undefined },
  supporter_source: { type: String, default: undefined },
  username: String,
  firstname: String,
  lastname: String,
  gender: String,
  dob: Date,
  jwt_version: { type: Number, default: 0 },
  avatar: String,
  votes: {
    type: [{
      is_active: { type: Boolean, default: true },
      bookmark_id: String,
      rating: Number,
      created_at: { type: Date, default: Date.now },
      modified_at: Date
    }],
    default: undefined
  },
  last_signin_at: Date,
  modified_at: Date,
  created_at: { type: Date, default: Date.now },
  /**
   * List of permission strings that will be enforced on this document.
   * By default, there is no need for access permissions except in special
   * cases.
   * [PRIORITY - LOW]
   */
  restrictions: { type: Map, of: String, default: undefined },
  /**
   * Cron job rules to be applied in special cases. e.g. At a certain date
   * and/or time, the document will automatically be modified via a scheduled
   * task.
   * [PRIORITY - LOW]
   */
  rules: { type: Map, of: String, default: undefined }
}, { versionKey: false })

// Ensure case-insensitive comparisons for the collection
userSchema.set('collation', { locale: 'en', strength: 2 })
userSchema.plugin(paginate)

export default userSchema
