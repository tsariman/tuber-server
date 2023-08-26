import { model } from 'mongoose'
import userSchema, { TUser } from 'src/schema/users'

export const UserModel  = model<TUser>('users', userSchema)