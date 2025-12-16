import {
  PaginateModel,
  PaginateResult,
  model
} from 'mongoose'
import { IMPV2Doc } from '../../common.types'
import { get_hashed_password } from '../../business.logic/security'
import Config from '../../config'
import userSchema, {
  IUser,
  IUserDocument,
  TUsersFastifyRequest
} from '../../schema/user'
import { DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from '@tuber/shared'

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
}

/** mongoose-paginate-v2 options */
const PAGINATION_OPTONS = {
  ...DB_PAGINATION_OPTIONS,
  select: {
    jwt_version: 0,
    password: 0,
  },

  // TODO Add custom pagination options here
}

/** User model for pagination */
export const UserPaginationModel = model<
  IUserDocument,
  PaginateModel<IUserDocument>
>('users', userSchema, 'users')

/** User model with no pagination */
export const UserModel = model<IUserDocument>('users', userSchema)

/** Exclude fields from the user document. @deprecated */
export const exclude_user_fields_IMPV2Doc = (user: IMPV2Doc<IUserDocument>) => {
  const {
    _doc: {
      jwt_version,
      is_active,
      password,
      restrictions,
      rules,
      __v,
      ...userDoc
    }
  } = user

  return userDoc
}

/** Excludes sensitive fields from the user document. */
export const transform_user_doc = (user: IUserDocument) => {
  const plainUser = user.toObject()
  const {
    jwt_version,
    is_active,
    password,
    restrictions,
    rules,
    email_verification_code,
    email_verification_code_expires,
    _id,
    __v,
    ...userDoc
  } = plainUser
  return userDoc
}

export const read_user_by_id = async (
  id: string
): Promise<IUserDocument | null> => {
  const userDoc = await UserModel.findById(id).select('-password -jwt_version -restrictions -rules')
  return userDoc
}

export const read_user_by_name = async (
  name: string
): Promise<IUserDocument | null> => {
  const userDoc = await UserModel.findOne({ name: name.trim().toLowerCase() })
  return userDoc
}

/** Create a new user */
export const create_user = async (userInfo: IUser): Promise<IUserDocument> => {
  const name = typeof userInfo.name === 'string' ? userInfo.name.trim() : userInfo.name
  const email = typeof userInfo.email === 'string' ? userInfo.email.trim().toLowerCase() : userInfo.email

  const createPayload: Partial<IUser> = {
    ...userInfo,
    name,
    email,
  }

  if (userInfo.password) {
    createPayload.password = await get_hashed_password(userInfo.password)
  }

  const um = await UserPaginationModel.create(createPayload as IUser)
  const user = await um.save()
  return user
}

/** Get all users */
export const read_user_collection = async (
  req: TUsersFastifyRequest
): Promise<PaginateResult<IUserDocument>> => {
  const page = Number(req.query.page?.number ?? 1)
  const limit = Number(req.query.page?.size ?? Config.PAGINATION_USER_LIMIT)
  const result = await UserPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  })
  return result
}

/** Find a user by email using mongoose */
export const read_user_by_email = async (
  email: string
): Promise<IUserDocument | null> => {
  const userDoc = await UserModel.findOne({ email: email.trim().toLowerCase() })
  return userDoc
}

/** Return total number of documents in the users collection */
export const read_user_collection_count = async (): Promise<number> => {
  const count = await UserModel.countDocuments()
  return count
}