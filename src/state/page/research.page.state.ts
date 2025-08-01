import { TCipheredUser } from '../../schema/users';
import { TStatePage } from '../../common.types';
import { register } from '../../business.logic/registry';
import {
  $40_STATE_KEY,
  $70_STATE_KEY,
  THEME_LIGHT_APP_BAR_ICON_COLOR as ICON_COLOR,
} from '../../constants';
import researchPageAppbarState, {
  $63DarkThemeMode
} from '../appbar';
import {
  $66DarkThemeMode,
  $67DarkThemeMode,
  bookmarkAddFromUrlLinkState,
  darkModeLinkState,
  lightModeLinkState,
  powerLogoutLinkState,
  powerSignInLinkState,
} from '../nav.link';
import { dev_get_links_state } from 'src/DEV/link.state';

register('state', '40', $40_STATE_KEY);
/** Page state for research page app. @id 40 */
const researchPageState: TStatePage = {
  '_id': '40',
  '_key': $40_STATE_KEY,
  'title': 'Research',
  'content': '$webapp : tubeResearcher : bookmarks',
  'appbar': {
    'appbarStyle': 'middle_search',
    'items': [ ],
    'inputBaseProps': {
      'id': 'video-url',
      'placeholder': 'Search ...',
      'inputProps': { 'aria-label': 'Search Bookmarks' },
    },
    'searchFieldIcon': {
      'icon': 'public_outline',
      'iconProps': {
        'sx': { 'color': ICON_COLOR }
      }
    },
    'searchFieldIconButton': {
      'has': {
        'icon': 'search_outline',
        'onclickHandle': 'tuberCallbacks.appbarSearchBookmarks'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'submit search query'
    }
  },
  'layout': 'layout_none_no_appbar',
};

export default researchPageState;

/** Dark theme mode for research page state. @id 40 */
export const $40DarkThemeMode: TStatePage = {
  ...researchPageState,
};

register('state', '70', $70_STATE_KEY);
/** Listing (research alias) page state. @id 70 */
export const listingPageState: TStatePage = {
  ...researchPageState,
  '_id': '70',
  '_key': $70_STATE_KEY,
  'title': 'Listing',
};
/** Dark theme mode for listing (research alias) page state. @id 70 */
export const $70DarkThemeMode: TStatePage = { ...listingPageState };

/**
 * Get the research page state.
 *
 * @param usr User data from the decoded token.
 * @param mode theme mode
 * @returns state page
 *
 * @deprecated
 */
export function get_research_page_state(usr?: TCipheredUser): TStatePage {
  return {
    ...researchPageState,
    appbar: {
      ...researchPageAppbarState,
      items: [
        ...dev_get_links_state(usr),
        bookmarkAddFromUrlLinkState,
        lightModeLinkState,
        usr ? powerLogoutLinkState : powerSignInLinkState,
      ]
    }
  };
}

/**
 * Dark theme mode variant for research page state.
 *
 * @param usr user object retrieve from the decoded token.
 * @param mode theme mode
 * @returns page state
 *
 * @deprecated
 */
export function get_40_dark_theme_mode(usr?: TCipheredUser ): TStatePage {
  return {
    ...$40DarkThemeMode,
    appbar: {
      ...$63DarkThemeMode,
      items: [
        ...dev_get_links_state(usr),
        bookmarkAddFromUrlLinkState,
        darkModeLinkState,
        usr ? $66DarkThemeMode : $67DarkThemeMode,
      ]
    }
  };
}

/**
 * @param usr 
 * @returns
 * @id 70
 * @deprecated
 */
export function get_listing_page_state (usr?: TCipheredUser): TStatePage {
  return {
    ...listingPageState,
    appbar: {
      ...researchPageAppbarState,
      'searchFieldIconButton': {
        'has': {
          'icon': 'search_outline',
          'onclickHandle': 'tuberCallbacks.appbarFilterBookmarks'
        }
      },
      items: [
        ...dev_get_links_state(usr),
        bookmarkAddFromUrlLinkState,
        lightModeLinkState,
        usr ? powerLogoutLinkState : powerSignInLinkState,
      ]
    }
  };
}

/**
 * Get dark theme mode for listing page state.
 *
 * @param usr 
 * @returns 
 * @id 70
 *
 * @deprecated
 */
export function get_70_dark_theme_mode(usr?: TCipheredUser): TStatePage {
  return {
    ...$70DarkThemeMode,
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
