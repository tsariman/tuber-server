import {
  PaginateModel,
  PaginateResult,
  // connect,
  // disconnect,
  model
} from 'mongoose'
import { get_query } from 'src/business.logic'
import { IMPV2Doc } from 'src/business.logic/common.types'
import { get_hashed_password } from 'src/business.logic/security'
import Config from 'src/config'
import userSchema, { IUser, IUserDocument, TUser, TUsersFastifyRequest } from 'src/schema/users'

/** mongoose-paginate-v2 query */
const PAGINATION_QUERY = {
  ...Config.DB_PAGINATION_QUERY,

  // TODO Add custom pagination query here
}

/** mongoose-paginate-v2 options */
const PAGINATION_OPTONS = {
  ...Config.DB_PAGINATION_OPTIONS,
  select: {
    __v: 0,
    is_active: 0,
    jwt_version: 0,
    password: 0,
    restrictions: 0,
    rules: 0
  }

  // TODO Add custom pagination options here
}

/** User model for pagination */
export const UserPaginationModel = model<
  IUserDocument,
  PaginateModel<IUserDocument>
>('users', userSchema)

/** User model with no pagination */
export const UserModel = model<TUser>('users', userSchema)

/** Exclude fields from the user document. @deprecated */
export const exclude_user_fields = (user: IMPV2Doc) => {
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

export const get_user_by_name = async (name: string): Promise<IUser | null> => {
  // await connect(Config.DB_URI)
  const userDoc = await UserPaginationModel.findOne({ name })
  // await disconnect()
  return userDoc
}

/** Create a new user */
export const create_user = async (userInfo: IUser): Promise<IUser> => {
  // await connect(Config.DB_URI)
  const um = await UserPaginationModel.create({
    ...userInfo,
    password: await get_hashed_password(userInfo.password)
  })
  const user = await um.save()
  // await disconnect()
  return user
}

/** Get all users */
export const get_user_collection = async (
  req: TUsersFastifyRequest
): Promise<PaginateResult<IUserDocument>> => {
  const page = Number(get_query(req, 'page[number]', '1'))
  const limit = Number(get_query(req, 'page[size]', Config.PAGINATION_USER_LIMIT))
  // await connect(Config.DB_URI)
  const result = await UserPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  })
  // await disconnect()
  return result
}

/** Find a user by email using mongoose */
export const get_user_by_email = async (email: string): Promise<IUser | null> => {
  // await connect(Config.DB_URI)
  const userDoc = await UserModel.findOne({ email })
  // await disconnect()
  return userDoc
}

/** Return total number of documents in the users collection */
export const get_user_collection_count = async (): Promise<number> => {
  // await connect(Config.DB_URI)
  const count = await UserModel.countDocuments()
  // await disconnect()
  return count
}