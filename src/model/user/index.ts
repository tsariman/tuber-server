import { PaginateModel, PaginateResult, connect, disconnect, model } from 'mongoose'
import { get_hashed_password } from 'src/business.logic/security'
import Config from 'src/config'
import userSchema, { IUser, IUserDocument } from 'src/schema/users'

const PAGINATION_OPTONS = {
  limit: Config.PAGINATION_USER_LIMIT,
  sort: { createdAt: -1 }
}
export const UserModel  = model<
  IUserDocument,
  PaginateModel<IUserDocument>
>('users', userSchema)

export const get_user_by_name = async (name: string): Promise<IUser | null> => {
  await connect(Config.DB_URL)
  const userDoc = await UserModel.findOne({ name })
  await disconnect()
  return userDoc
}

/** Create a new user */
export const create_user = async (userInfo: IUser): Promise<IUser> => {
  await connect(Config.DB_URL)
  const um = await UserModel.create({
    ...userInfo,
    password: await get_hashed_password(userInfo.password)
  })
  const user = await um.save()
  await disconnect()
  return user
}

/** Get all users */
export const get_user_collection = async (
  page = 1
): Promise<PaginateResult<IUserDocument>> => {
  await connect(Config.DB_URL)
  const result = await UserModel.paginate({}, {
    ...PAGINATION_OPTONS,
    page
  })
  await disconnect()
  return result
}