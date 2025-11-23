import Config from '../../config';
import { TCipheredUser } from '../../schema/user';

/**
 * Check if the user is a developer and the app is in development mode.
 * @param usr user object retrieved from the decoded token.
 * @returns true if the user is a developer and the app is in development mode.
 */
export function is_dev(usr?: TCipheredUser): boolean {
  return (Config.DEV && usr?.role === 'developer') ?? false;
}