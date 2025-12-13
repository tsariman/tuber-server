import {
  homeLinkState,
  researchAppErrorsViewLinkState
} from '../state/nav.link';
import { TStateLink } from '@tuber/shared';
import { TContextualUser } from '../schema/user';
import { is_dev } from '../model/user/access';

/**
 * Get the dev links state.
 *
 * @param usr user object decoded from user token
 * @returns links state
 */
export function dev_get_links_state(usr?: TContextualUser): TStateLink[] {
  if (is_dev(usr)) {
    return [ researchAppErrorsViewLinkState, homeLinkState ];
  }
  return [];
}
