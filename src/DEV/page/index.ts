import { register } from '../../business.logic/registry';
import * as C from '../../constants.server';
import { defaultAppBarState } from '../../state/default.content';
import devInstallPageState, {
  $44DarkThemeMode,
  get_44_dark_theme_mode,
  get_dev_install_page_state
} from './dev.install.page.state';
import { TStateAllPages, TStatePage } from '../../shared';
import { TThemeMode } from '../../common.types';
import devSignedInPageState, {
  $43DarkThemeMode
} from './dev.signedin-appbar.page.state';
import {
  get_state_key as key,
  remove_form_suffix,
  themed
} from '../../business.logic';
import { TCipheredUser } from 'src/schema/users';

register('state', '46', C.$46_STATE_KEY);
/** @id 46 */
export const devTestThumbnailPageState: TStatePage = {
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

export const $46DarkThemeMode: TStatePage = {
  ...devTestThumbnailPageState,
};

register('state', '56', C.$56_STATE_KEY);
/** @id 56 */
export const devTestRumbleRegexpPageState: TStatePage = {
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
      {
        'has': {
          'text': 'Home',
          'route': '/'
        }
      }
    ]
  },
};

export const $56DarkThemeMode: TStatePage = {
  ...devTestRumbleRegexpPageState,
};

register('state', '58', C.$58_STATE_KEY);
/** @id 58 */
export const devTestUnknownRegexpPageState: TStatePage = {
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
      {
        'has': {
          'text': 'Home',
          'route': '/'
        }
      }
    ]
  },
};

export const $58DarkThemeMode: TStatePage = {
  ...devTestUnknownRegexpPageState,
};

register('state', '59', C.$59_STATE_KEY);
/** @id 59 */
export const devTwitchInputClientIdPageState: TStatePage = {
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
      {
        'has': {
          'text': 'Home',
          'route': '/'
        }
      }
    ]
  },
};

export const $59DarkThemeMode: TStatePage = {
  ...devTwitchInputClientIdPageState,
};

register('state', '61', C.$61_STATE_KEY);
/** @id 61 */
export const devSaveConfigValuePageState: TStatePage = {
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
      {
        'has': {
          'text': 'Home',
          'route': '/'
        }
      }
    ]
  },
};

export const $61DarkThemeMode: TStatePage = {
  ...devSaveConfigValuePageState,
};

register('state', '48', C.$48_STATE_KEY);
/** @id 48 */
export const devResearchErrorsViewPageState: TStatePage = {
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

export const $48DarkThemeMode: TStatePage = {
  ...devResearchErrorsViewPageState,
};

/** @deprecated */
export function dev_bootstrap_pages_light_state(
  usr?: TCipheredUser
): TStateAllPages {
  const pages: TStateAllPages = {};
  pages[key(devInstallPageState)] = get_dev_install_page_state(usr);

  // TODO: Don't forget to insert light mode state for each page

  return pages;
}

/** @deprecated */
export function dev_bootstrap_pages_dark_state(
  usr?: TCipheredUser
): TStateAllPages {
  const pages: TStateAllPages = {};
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
  usr?: TCipheredUser,
  mode?: TThemeMode
): TStateAllPages {
  const pages: TStateAllPages = {};
  const light = get_dev_install_page_state(usr);
  const dark = get_44_dark_theme_mode(usr);
  pages[key(devInstallPageState)] = themed(light, dark, mode);

  return pages;
}

const DEV_STATE_PAGES: TStateAllPages = {
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

export const DEV_STATE_PAGES_THEME_DARK: TStateAllPages = {
  [C.$43_STATE_KEY]: $43DarkThemeMode,
  [C.$44_STATE_KEY]: $44DarkThemeMode,
  [C.$46_STATE_KEY]: $46DarkThemeMode,
  [C.$48_STATE_KEY]: $48DarkThemeMode,
  [C.$56_STATE_KEY]: $56DarkThemeMode,
  [C.$58_STATE_KEY]: $58DarkThemeMode,
  [C.$59_STATE_KEY]: $59DarkThemeMode,
  [C.$61_STATE_KEY]: $61DarkThemeMode,
};
