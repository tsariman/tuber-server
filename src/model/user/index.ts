import { model } from 'mongoose'
import userSchema, { IUser } from 'src/schema/users'

export const UserModel  = model<IUser>('users', userSchema)