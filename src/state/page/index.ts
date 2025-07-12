import { defaultAppBarState } from '../default.content';
import Config from '../../config';
import * as C from '../../constants';
import researchPageState, {
  $40DarkThemeMode,
  $70DarkThemeMode,
  get_40_dark_theme_mode,
  get_70_dark_theme_mode,
  get_listing_page_state,
  get_research_page_state,
  listingPageState
} from './research.page.state';
import DEV_STATE_PAGES, {
  DEV_STATE_PAGES_THEME_DARK,
  dev_bootstrap_pages_dark_state,
  dev_bootstrap_pages_light_state,
  dev_bootstrap_pages_state
} from '../../DEV/page';
import adminReadablePageState from '../../ADMIN/page/admin.readable.page.state';
import { TStateAllPages, TStatePage, TThemeMode } from '../../common.types';
import {
  get_state_key as key,
  remove_form_suffix,
  set_state_by_key,
  themed
} from '../../business.logic';
import chippedListingPageState, {
  $51DarkThemeMode,
  get_chipped_listing_page_state,
  get_51_dark_theme_mode,
} from './listing.page.state';
import { is_dev } from '../../model/user/access';
import { TCipheredUser } from '../../schema/users';

Config.register('state', '42', C.$42_STATE_KEY);
/** Sign in page state @id 42 */
export const signInPageState: TStatePage = {
  '_id': '42',
  '_key': C.$42_STATE_KEY,
  'content': `$form : ${remove_form_suffix(C.$41_STATE_KEY)} : ${C.EP_AUTHENTICATE}`,
  'layout': 'layout_centered_no_scroll',
  'appbar': {
    'appbarStyle': 'mini',
    'props': defaultAppBarState.props,
    'items': [
      {
        'has': {
          'text': 'Home',
          'route': '/'
        }
      }
    ]
  },
  'hideDrawer': true
};

/** Dark theme mode sign in page state @id 42 */
export const $42DarkThemeMode: TStatePage = {
  ...signInPageState,
};

/**
 * Get the research page state.
 *
 * @param list of all pages
 * @param mode theme mode
 * 
 * @deprecated
 */
export function bootstrap_pages_state(
  usr?: TCipheredUser,
  mode?: TThemeMode
): TStateAllPages {
  const pages: TStateAllPages = {
    ...(is_dev(usr) ? dev_bootstrap_pages_state(usr, mode) : {})
  };
  pages[key(researchPageState)] = themed(
    get_research_page_state(usr),
    get_40_dark_theme_mode(usr),
    mode
  );
  pages[key(listingPageState)] = themed(
    get_listing_page_state(usr),
    get_70_dark_theme_mode(usr),
    mode
  );
  pages[key(chippedListingPageState)] = themed(
    get_chipped_listing_page_state(usr),
    get_51_dark_theme_mode(usr),
    mode
  );

  return pages;
}

/** @deprecated */
export function bootstrap_pages_light_state(
  usr?: TCipheredUser
): TStateAllPages {
  const pages: TStateAllPages = {
    ...(is_dev(usr) ? dev_bootstrap_pages_light_state(usr) : {})
  };
  set_state_by_key(pages, get_research_page_state(usr));
  set_state_by_key(pages, get_chipped_listing_page_state(usr));
  set_state_by_key(pages, get_listing_page_state(usr));

  // TODO: If you want a page to be bootstrapped in light mode, you must
  //       insert it here.

  return pages;
}

/**
 * Bootstrap state for pages dark theme mode.
 *
 * @param usr user object decoded from user token.
 * @returns dark theme mode pages state.
 * 
 * @deprecated
 */
export function bootstrap_pages_dark_state(
  usr?: TCipheredUser,
): TStateAllPages {
  const pages: TStateAllPages = {
    ...(is_dev(usr) ? dev_bootstrap_pages_dark_state() : {})
  };
  set_state_by_key(pages, get_40_dark_theme_mode(usr));
  set_state_by_key(pages, get_51_dark_theme_mode(usr));
  set_state_by_key(pages, get_70_dark_theme_mode(usr));

  // TODO: If you want a page to be bootstrapped in dark mode, you must
  //       insert it here.

  return pages;
}

/** All pages state for dark theme mode. */
export const STATE_PAGES_THEME_DARK: TStateAllPages = {
  [C.$40_STATE_KEY]: $40DarkThemeMode,
  [C.$42_STATE_KEY]: $42DarkThemeMode,
  [C.$51_STATE_KEY]: $51DarkThemeMode,
  [C.$70_STATE_KEY]: $70DarkThemeMode,

  // TODO: For a page to be accessible in dark mode, you must insert it here.

  ...(Config.DEV ? DEV_STATE_PAGES_THEME_DARK : {})
};

/** All pages state. */
export const STATE_PAGES: TStateAllPages = {
  [C.$40_STATE_KEY]: researchPageState,
  [C.$42_STATE_KEY]: signInPageState,
  [C.$51_STATE_KEY]: chippedListingPageState,
  [C.$70_STATE_KEY]: listingPageState,

  // TODO: For a page to be accessible in light mode, you must insert it here.

  ...(Config.DEV ? DEV_STATE_PAGES : {})
};

// [TODO] Wrap in a conditional to check if the user is an admin
STATE_PAGES[C.$53_STATE_KEY] = adminReadablePageState;

/**
 * __`[user theme]`__ Get a page state by key and theme mode.
 *
 * @param key page key
 * @param mode theme mode
 * @returns page state
 */
export function get_page_state(key: string, mode?: TThemeMode): TStatePage {
  const lightState = STATE_PAGES[key];
  const darkState = STATE_PAGES_THEME_DARK[key];
  return themed(lightState, darkState, mode);
}
