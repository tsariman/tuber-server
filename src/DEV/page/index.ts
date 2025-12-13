import { register } from '../../business.logic/registry';
import * as C from '@tuber/shared';
import { defaultAppBarState } from '../../state/default.content';
import devInstallPageState, {
  $44DarkThemeMode,
  get_44_dark_theme_mode,
  get_dev_install_page_state
} from './dev.install.page.state';
import { TThemeMode } from '../../common.types';
import devSignedInPageState, {
  $43DarkThemeMode
} from './dev.signedin-appbar.page.state';
import {
  clone_with_descriptors,
  get_state_key as key,
  remove_form_suffix,
  themed
} from '../../business.logic';
import { TContextualUser } from '../../schema/user';
import { homeLinkState } from '../../state/nav.link';

register('state', '46', C.$46_STATE_KEY);
/** @id 46 */
export const devTestThumbnailPageState: C.TStatePage = {
  '_id': '46',
  '_key': C.$46_STATE_KEY,
  'appbar': {
    'items': [
      {
        'has': {
          'text': 'Client errors',
          'route': 'default-errors-view'
        }
      },
      {
        'has': {
          'text': 'Back',
          'route': C.$44_STATE_KEY
        }
      }
    ],
    'toolbarProps': { 'variant': 'dense' }
  },
  'content': `$form : ${remove_form_suffix(C.$45_STATE_KEY)}`,
  'layout': 'layout_centered_no_scroll'
};

export const $46DarkThemeMode: C.TStatePage = (() => {
  const base = clone_with_descriptors(devTestThumbnailPageState);
  return base;
})();

register('state', '56', C.$56_STATE_KEY);
/** @id 56 */
export const devTestRumbleRegexpPageState: C.TStatePage = {
  '_id': '56',
  '_key': C.$56_STATE_KEY,
  'content': `$form : ${remove_form_suffix(C.$54_STATE_KEY)} : test-rumble-regexp`,
  'layout': 'layout_centered_no_scroll',
  'appbar': {
    'appbarStyle': 'mini',
    'props': defaultAppBarState.props,
    'items': [
      {
        'has': {
          'text': 'Errors',
          'route': 'default-errors-view'
        }
      },
      homeLinkState
    ]
  },
};

export const $56DarkThemeMode: C.TStatePage = (() => {
  const base = clone_with_descriptors(devTestRumbleRegexpPageState);
  return base;
})();

register('state', '58', C.$58_STATE_KEY);
/** @id 58 */
export const devTestUnknownRegexpPageState: C.TStatePage = {
  '_id': '58',
  '_key': C.$58_STATE_KEY,
  'content': `$form : ${remove_form_suffix(C.$57_STATE_KEY)} : test-unknown-regexp`,
  'layout': 'layout_centered_no_scroll',
  'appbar': {
    'appbarStyle': 'mini',
    'props': defaultAppBarState.props,
    'items': [
      {
        'has': {
          'text': 'Errors',
          'route': 'default-errors-view'
        }
      },
      homeLinkState
    ]
  },
};

export const $58DarkThemeMode: C.TStatePage = (() => {
  const base = clone_with_descriptors(devTestUnknownRegexpPageState);
  return base;
})();

register('state', '59', C.$59_STATE_KEY);
/** @id 59 */
export const devTwitchInputClientIdPageState: C.TStatePage = {
  '_id': '59',
  '_key': C.$59_STATE_KEY,
  'content': `$form : ${remove_form_suffix(C.$60_STATE_KEY)} : save-twitch-client-id`,
  'layout': 'layout_centered_no_scroll',
  'appbar': {
    'appbarStyle': 'mini',
    'props': defaultAppBarState.props,
    'items': [
      {
        'has': {
          'text': 'Errors',
          'route': 'default-errors-view'
        }
      },
      homeLinkState
    ]
  },
};

export const $59DarkThemeMode: C.TStatePage = (() => {
  const base = clone_with_descriptors(devTwitchInputClientIdPageState);
  return base;
})();

register('state', '61', C.$61_STATE_KEY);
/** @id 61 */
export const devSaveConfigValuePageState: C.TStatePage = {
  '_id': '61',
  '_key': C.$61_STATE_KEY,
  'content': `$form : ${remove_form_suffix(C.$62_STATE_KEY)} : ${C.$61_STATE_KEY}`,
  'layout': 'layout_centered_no_scroll',
  'appbar': {
    'appbarStyle': 'mini',
    'props': defaultAppBarState.props,
    'items': [
      {
        'has': {
          'text': 'Errors',
          'route': 'default-errors-view'
        }
      },
      homeLinkState
    ]
  },
};

export const $61DarkThemeMode: C.TStatePage = (() => {
  const base = clone_with_descriptors(devSaveConfigValuePageState);
  return base;
})();

register('state', '48', C.$48_STATE_KEY);
/** @id 48 */
export const devResearchErrorsViewPageState: C.TStatePage = {
  '_id': '48',
  '_key': C.$48_STATE_KEY,
  'content': '$view : default_errors_page_view',
  'layout': 'layout_none_no_appbar',
  'appbar': {
    'items': [
      {
        'has': {
          'text': 'Back',
          'route': C.$40_STATE_KEY
        }
      }
    ]
  }
};

export const $48DarkThemeMode: C.TStatePage = (() => {
  const base = clone_with_descriptors(devResearchErrorsViewPageState);
  return base;
})();

/** @deprecated */
export function dev_bootstrap_pages_light_state(
  usr?: TContextualUser
): C.TStateAllPages {
  const pages: C.TStateAllPages = {};
  pages[key(devInstallPageState)] = get_dev_install_page_state(usr);

  // TODO: Don't forget to insert light mode state for each page

  return pages;
}

/** @deprecated */
export function dev_bootstrap_pages_dark_state(
  usr?: TContextualUser
): C.TStateAllPages {
  const pages: C.TStateAllPages = {};
  pages[key(devInstallPageState)] = get_44_dark_theme_mode(usr);

  // TODO: Don't forget to insert dark mode state for each page

  return pages;
}

/**
 * Get the page state for development, testing, and installation.
 *
 * @param list of all pages
 * @param mode theme mode
 * @returns void
 *
 * @deprecated
 */
export function dev_bootstrap_pages_state(
  usr?: TContextualUser,
  mode?: TThemeMode
): C.TStateAllPages {
  const pages: C.TStateAllPages = {};
  const light = get_dev_install_page_state(usr);
  const dark = get_44_dark_theme_mode(usr);
  pages[key(devInstallPageState)] = themed(light, dark, mode);

  return pages;
}

const DEV_STATE_PAGES: C.TStateAllPages = {
  [C.$43_STATE_KEY]: devSignedInPageState,
  [C.$44_STATE_KEY]: devInstallPageState,
  [C.$46_STATE_KEY]: devTestThumbnailPageState,
  [C.$48_STATE_KEY]: devResearchErrorsViewPageState,
  [C.$56_STATE_KEY]: devTestRumbleRegexpPageState,
  [C.$58_STATE_KEY]: devTestUnknownRegexpPageState,
  [C.$59_STATE_KEY]: devTwitchInputClientIdPageState,
  [C.$61_STATE_KEY]: devSaveConfigValuePageState,
};

export default DEV_STATE_PAGES;

export const DEV_STATE_PAGES_THEME_DARK: C.TStateAllPages = {
  [C.$43_STATE_KEY]: $43DarkThemeMode,
  [C.$44_STATE_KEY]: $44DarkThemeMode,
  [C.$46_STATE_KEY]: $46DarkThemeMode,
  [C.$48_STATE_KEY]: $48DarkThemeMode,
  [C.$56_STATE_KEY]: $56DarkThemeMode,
  [C.$58_STATE_KEY]: $58DarkThemeMode,
  [C.$59_STATE_KEY]: $59DarkThemeMode,
  [C.$61_STATE_KEY]: $61DarkThemeMode,
};
