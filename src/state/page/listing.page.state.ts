import { TCipheredUser } from '../../schema/users';
import { TStatePage } from '../../shared';
import { register } from '../../business.logic/registry';
import { $51_STATE_KEY } from '../../constants.server';
import { $71DarkThemeMode, listingPageAppbarState } from '../appbar';
import {
  bookmarkAddFromUrlLinkState,
  darkModeLinkState,
  lightModeLinkState,
  powerLogoutLinkState,
  powerSignInLinkState
} from '../nav.link';
import { dev_get_links_state } from '../../DEV/link.state';
import { clone_with_descriptors } from '../../business.logic';

register('state', '51', $51_STATE_KEY);
/** Page state for listing app. @id 51 */
const chippedListingPageState = {
  '_id': '51',
  '_key': $51_STATE_KEY,
  'title': 'Chipped Listing',
  'content': '$webapp : tubeResearcher : listing',
  'appbar': {
    'appbarStyle': 'middle_search',
    'items': [ ],
    'inputBaseProps': {
      'id': 'filter-listing',
      'placeholder': 'Filter ...',
      'inputProps': { 'aria-label': 'Search Bookmarks' },
    },
    'inputBaseChips': [

      // Example of a chip
      {
        'label': 'Default',
        'color': 'primary',
        'variant': 'filled',
        'ondeleteHandle': 'tuberCallbacks.$51_C_1'
      }
    ],
    'searchFieldIcon': {
      'icon': 'public_outline',
      'svgIconProps': {
        'sx': { 'color': '#fff' }
      }
    },
    'searchFieldIconButton': {
      'has': {
        'icon': 'filter_list_outline',
        'onclickHandle': 'tuberCallbacks.appbarFilterBookmarks'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'submit search query'
    }
  },
  'layout': 'layout_none_no_appbar',
} as TStatePage;

export default chippedListingPageState;

/** Dark theme mode for listing page state. @id 51 */
export const $51DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(chippedListingPageState);
  return base;
})();

/** @deprecated */
export function get_chipped_listing_page_state(usr?: TCipheredUser): TStatePage {
  const base = clone_with_descriptors(chippedListingPageState);
  const appbar = clone_with_descriptors(listingPageAppbarState);
  const items = clone_with_descriptors(dev_get_links_state(usr));
  items.push(bookmarkAddFromUrlLinkState);
  items.push(lightModeLinkState);
  items.push(usr ? powerLogoutLinkState : powerSignInLinkState);
  appbar.items = items;
  base.appbar = appbar;
  return base;
}

/** @deprecated */
export function get_51_dark_theme_mode(usr?: TCipheredUser): TStatePage {
  const base = clone_with_descriptors($51DarkThemeMode);
  const appbar = clone_with_descriptors($71DarkThemeMode);
  const items = dev_get_links_state(usr);
  items.push(bookmarkAddFromUrlLinkState);
  items.push(darkModeLinkState);
  items.push(usr ? powerLogoutLinkState : powerSignInLinkState);
  appbar.items = items;
  base.appbar = appbar;
  return base;
};
