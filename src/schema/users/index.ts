import mongoose, { Schema } from 'mongoose';
import { IJsonapiQuerystring, WithRequired } from '../../common.types';
import { TRole } from '../../business.logic/security/permissions';
import { FastifyRequest } from 'fastify';
import paginate from 'mongoose-paginate-v2';

export interface IUser {
  is_active?: boolean;
  /** Username */
  name: string;
  email: string;
  email_verified?: boolean;
  email_verification_code?: string;
  email_verification_code_expires?: Date;
  email_verified_at?: Date;
  email_2?: string;
  email_3?: string;
  phone?: string;
  password?: string;
  role?: TRole;
  username?: string;
  firstname?: string;
  lastname?: string;
  gender?: 'male' | 'female';
  /** Date of birth */
  dob?: Date;
  jwt_version?: number;
  avatar?: string;
  votes?: {
    is_active?: boolean;
    bookmark_id: string;
    rating: 1 | -1; // 1 = upvote, -1 = downvote
    created_at?: Date;
    modified_at?: Date;
  }[];
  last_accessed?: Date;
  modified_at?: Date;
  created_at?: Date;
  restrict?: Record<string, string>;
  rules?: Record<string, string>;
}

export interface IUsersEndpoint {
  Body: IUser;
  Params: {
    name: string;
  }
  Querystring: IJsonapiQuerystring;
}

export type TUsersFastifyRequest = FastifyRequest<IUsersEndpoint>;

/**
 * Similar to the user interface except some keys which were optional are now
 * required since the schema gives them a default value.
 */
export type TUser = WithRequired<IUser,
  'is_active' | 'jwt_version' | 'created_at' | 'role'
>;

export interface IUserDocument extends TUser, mongoose.Document<string> {}

export type TCipheredUser = Pick<IUserDocument, '_id' | 'name' | 'jwt_version' | 'role'>;

const userSchema = new Schema<IUserDocument>({
  is_active: {type: Boolean, default: true },
  name: {type: String, unique: true},
  email: {type: String, unique: true},
  email_verified: { type: Boolean, default: false },
  email_verification_code: String,
  email_verification_code_expires: Date,
  email_verified_at: Date,
  email_2: String,
  email_3: String,
  phone: String,
  password: { type: String, default: null },
  role: { type: String, default: 'free' },
  username: String,
  firstname: String,
  lastname: String,
  gender: String,
  dob: Date,
  jwt_version: { type: Number, default: 0 },
  avatar: String,
  votes: [{
    is_active: { type: Boolean, default: true },
    bookmark_id: String,
    rating: Number,
    created_at: { type: Date, default: Date.now },
    modified_at: Date
  }],
  last_accessed:  Date,
  modified_at: Date,
  created_at: { type: Date, default: Date.now },
  /**
   * List of permission strings that will be enforced on this document.
   * By default, there is no need for access permissions except in special
   * cases.
   * [PRIORITY - LOW]
   */
  restrict: { type: Map, of: String, default: undefined },
  /**
   * Cron job rules to be applied in special cases. e.g. At a certain date
   * and/or time, the document will automatically be modified via a scheduled
   * task.
   * [PRIORITY - LOW]
   */
  rules: { type: Map, of: String, default: undefined }
});

userSchema.plugin(paginate);

export default userSchema;
