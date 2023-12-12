import {
  PaginateModel,
  PaginateResult,
  model
} from 'mongoose'
import { get_query } from '../../business.logic'
import { IMPV2Doc } from '../../common.types'
import { get_hashed_password } from '../../business.logic/security'
import Config from '../../config'
import userSchema, { IUser, IUserDocument, TCipheredUser, TUsersFastifyRequest } from '../../schema/users'
import { DB_PAGINATION_OPTIONS, DB_PAGINATION_QUERY } from '../../constants'

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
  }

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

export const get_user_by_name = async (
  name: string
): Promise<IUserDocument | null> => {
  const userDoc = await UserPaginationModel.findOne({ name })
  return userDoc
}

/**
 * Get a _user_ by name.  
 * Use this function to retrieve a logged in user document information.
 * @param username Username
 * @returns User document
 */
export const get_user = async (
  username: string
): Promise<TCipheredUser | null> => {
  const cUsr = Config.USER_CACHE.get(username)
  if (cUsr) return cUsr as TCipheredUser
  const dbUser = await get_user_by_name(username)
  if (!dbUser) return null
  const { name, role, jwt_version } = dbUser
  return { name, role, jwt_version }
}

/** Create a new user */
export const create_user = async (userInfo: IUser): Promise<IUser> => {
  const um = await UserPaginationModel.create({
    ...userInfo,
    password: await get_hashed_password(userInfo.password)
  })
  const user = await um.save()
  return user
}

/** Get all users */
export const get_user_collection = async (
  req: TUsersFastifyRequest
): Promise<PaginateResult<IUserDocument>> => {
  const page = Number(get_query(req, 'page[number]', '1'))
  const limit = Number(get_query(req, 'page[size]', Config.PAGINATION_USER_LIMIT))
  const result = await UserPaginationModel.paginate(PAGINATION_QUERY, {
    ...PAGINATION_OPTONS,
    page,
    limit
  })
  return result
}

/** Find a user by email using mongoose */
export const get_user_by_email = async (email: string): Promise<IUser | null> => {
  const userDoc = await UserModel.findOne({ email })
  return userDoc
}

/** Return total number of documents in the users collection */
export const get_user_collection_count = async (): Promise<number> => {
  const count = await UserModel.countDocuments()
  return count
}