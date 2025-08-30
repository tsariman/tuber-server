import { TCipheredUser } from '../../schema/users';
import { TStatePage } from '../../shared';
import { register } from '../../business.logic/registry';
import {
  $40_STATE_KEY,
  $70_STATE_KEY,
  THEME_LIGHT_APP_BAR_ICON_COLOR as ICON_COLOR,
} from '../../constants.server';
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
import { dev_get_links_state } from '../../DEV/link.state';
import { clone_or_default, clone_with_descriptors } from '../../business.logic';

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
      'svgIconProps': {
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
export const $40DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(researchPageState);
  return base;
})();

register('state', '70', $70_STATE_KEY);
/** Listing (research alias) page state. @id 70 */
export const listingPageState: TStatePage = (() => {
  const base = clone_with_descriptors(researchPageState);
  base._id = '70';
  base._key = $70_STATE_KEY;
  base.title = 'Listing';
  return base;
})();
/** Dark theme mode for listing (research alias) page state. @id 70 */
export const $70DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(listingPageState);
  return base;
})();

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
  const base = clone_with_descriptors(researchPageState);
  const appbar = clone_with_descriptors(researchPageAppbarState);
  const items = dev_get_links_state(usr);
  items.push(bookmarkAddFromUrlLinkState);
  items.push(lightModeLinkState);
  items.push(usr ? powerLogoutLinkState : powerSignInLinkState);
  appbar.items = items;
  base.appbar = appbar;
  return base;
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
  const base = clone_with_descriptors($40DarkThemeMode);
  const appbar = clone_with_descriptors($63DarkThemeMode);
  const items = dev_get_links_state(usr);
  items.push(bookmarkAddFromUrlLinkState);
  items.push(darkModeLinkState);
  items.push(usr ? $66DarkThemeMode : $67DarkThemeMode);
  appbar.items = items;
  base.appbar = appbar;
  return base;
}

/**
 * @param usr 
 * @returns
 * @id 70
 * @deprecated
 */
export function get_listing_page_state (usr?: TCipheredUser): TStatePage {
  const base = clone_with_descriptors(listingPageState);
  const appbar = clone_with_descriptors(researchPageAppbarState);
  const searchFieldIconButton = clone_or_default(appbar.searchFieldIconButton, {});
  const has = clone_or_default(searchFieldIconButton.has, {});
  has.icon = 'search_outline';
  has.onclickHandle = 'tuberCallbacks.appbarFilterBookmarks';
  searchFieldIconButton.has = has;
  appbar.searchFieldIconButton = searchFieldIconButton;
  const items = dev_get_links_state(usr);
  items.push(bookmarkAddFromUrlLinkState);
  items.push(lightModeLinkState);
  items.push(usr ? powerLogoutLinkState : powerSignInLinkState);
  appbar.items = items;
  base.appbar = appbar;
  return base;
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
  const base = clone_with_descriptors($70DarkThemeMode);
  const appbar = clone_with_descriptors($63DarkThemeMode);
  const items = dev_get_links_state(usr);
  items.push(bookmarkAddFromUrlLinkState);
  items.push(darkModeLinkState);
  items.push(usr ? powerLogoutLinkState : powerSignInLinkState);
  appbar.items = items;
  base.appbar = appbar;
  return base;
};
