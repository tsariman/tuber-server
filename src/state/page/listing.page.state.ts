import { TCipheredUser } from 'src/schema/users';
import { TStatePage } from '../../common.types';
import Config from '../../config';
import { $51_STATE_KEY } from '../../constants';
import researchPageAppBarState, {
  $63DarkThemeMode
} from '../appbar/research.page.appbar.state';
import {
  bookmarkAddFromUrlLinkState,
  darkModeLinkState,
  lightModeLinkState,
  powerLogoutLinkState,
  powerSignInLinkState
} from '../nav.link';
import { dev_get_links_state } from 'src/DEV/link.state';

Config.register('state', '51', $51_STATE_KEY);
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
      'iconProps': {
        'sx': { 'color': '#fff' }
      }
    },
    'searchFieldIconButton': {
      'has': {
        'icon': 'search_outline',
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
export const $51DarkThemeMode: TStatePage = {
  ...chippedListingPageState,
};

export function get_chipped_listing_page_state(
  usr?: TCipheredUser
): TStatePage {
  return {
    ...chippedListingPageState,
    appbar: {
      ...researchPageAppBarState,
      items: [
        ...dev_get_links_state(usr),
        bookmarkAddFromUrlLinkState,
        lightModeLinkState,
        usr ? powerLogoutLinkState : powerSignInLinkState,
      ]
    }
  };
}

export function get_51_dark_theme_mode(usr?: TCipheredUser): TStatePage {
  return {
    ...$51DarkThemeMode,
    appbar: {
      ...$63DarkThemeMode,
      items: [
        ...dev_get_links_state(usr),
        bookmarkAddFromUrlLinkState,
        darkModeLinkState,
        usr ? powerLogoutLinkState : powerSignInLinkState,
      ]
    }
  };
}
