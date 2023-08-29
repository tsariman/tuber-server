import { connect, disconnect, model } from 'mongoose'
import { get_hashed_password } from 'src/business.logic/security'
import Config from 'src/config'
import userSchema, { IUser, TUser } from 'src/schema/users'

export const UserModel  = model<TUser>('users', userSchema)

export const get_user_by_name = async (name: string): Promise<TUser | null> => {
  await connect(Config.DB_URL)
  const userDoc = await UserModel.findOne({ name })
  await disconnect()
  return userDoc
}

/** Create a new user */
export const create_user = async (userInfo: IUser): Promise<TUser> => {
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
export const get_user_collection = async (): Promise<TUser[]> => {
  await connect(Config.DB_URL)
  const users = await UserModel.find()
  await disconnect()
  return users
}