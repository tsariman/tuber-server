import { defaultAppBarState } from '../default.content';
import Config from '../../config';
import { register } from '../../business.logic/registry';
import * as C from '@tuber/shared';
import researchPageState, {
  $40DarkThemeMode,
  $70DarkThemeMode,
  listingPageState
} from './research.page.state';
import DEV_STATE_PAGES, {
  DEV_STATE_PAGES_THEME_DARK,
} from '../../DEV/page';
import adminReadablePageState from '../../ADMIN/page/admin.readable.page.state';
import { TStateAllPages, TStatePage } from '@tuber/shared';
import {
  clone_with_descriptors,
  remove_form_suffix,
} from '../../business.logic';
import chippedListingPageState, {
$51DarkThemeMode,
} from './listing.page.state';

register('state', '42', C.$42_STATE_KEY);
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
export const $42DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(signInPageState);
  return base;
})();

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
