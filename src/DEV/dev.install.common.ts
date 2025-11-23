import bcrypt from 'bcrypt';
import { model } from 'mongoose';
import Config from '../config';
import userSchema, { IUser, IUserDocument } from '../schema/user';

/**
 * The name of the file in which the id of the default developer user will be
 * saved.
 */
export const DEV_USER_FILENAME = 'd1684a88be5c08aed50f565d9c8063ca.txt';
/** Default dev user password. */
export const DEV_DEFAULT_USER_PWD = Config.DEV_DEFAULT_DEV_USER_PASSWORD;

export const DEV_USER = model<IUserDocument>('User', userSchema);

/** Template for default user for the purpose of developing and testing. */
export const DEV_DEFAULT_USER: IUser = {
  name: 'riviere',
  password: Config.DEV_DEFAULT_DEV_USER_PASSWORD,
  role: 'developer',
  email: 'dev@tuberesearcher.local',
  // [TODO][PRIORITY-LOW] Work on avatar
  // avatar: 'https://i.imgur.com/dM7Thhn.png'
};

/** Get default dev user's hashed password. */
export async function devGetHashedDefaultUsrPwd() {
  const hashedPwd = await bcrypt.hash(
    Config.DEV_DEFAULT_DEV_USER_PASSWORD,
    Config.PWD_SALT_ROUNDS
  );
  return hashedPwd;
}