import bcrypt from 'bcrypt';
import Config from '../../config';
import { TCipheredUser } from '../../schema/users';
import { ROLE_CLEARANCE_LEVEL } from './permissions';

export async function get_hashed_password(password?: string) {
  if (password) {
    return await bcrypt.hash(password, Config.PWD_SALT_ROUNDS);
  }
  return '';
}

export async function check_password(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}

/**
 * Check if a user has sufficient clearance level to view unpublished bookmarks.
 * Users with clearance level 4 (moderator/patron) and above can view all unpublished bookmarks.
 * 
 * @param usr - The authenticated user
 * @returns `true` if user has clearance level >= 4, `false` otherwise
 */
export function can_view_unpublished_bookmarks(usr?: TCipheredUser): boolean {
  if (!usr?.role) {
    return false;
  }
  const clearanceLevel = ROLE_CLEARANCE_LEVEL[usr.role];
  return clearanceLevel >= 4;
}
