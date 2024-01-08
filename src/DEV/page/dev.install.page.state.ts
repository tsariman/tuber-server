import {
  $66DarkThemeMode,
  $67DarkThemeMode,
  authenticatedLinkState,
  powerLogoutLinkState,
  powerSignInLinkState
} from '../../state/nav.link';
import Config from '../../config';
import { $40_STATE_KEY, $44_STATE_KEY } from '../../constants';
import { TStateAppbar, TStatePage } from '../../common.types';
import { TCipheredUser } from 'src/schema/users';

export const appbarLinksState: TStateAppbar['items'] = [
  {
    'has': {
      'text': 'Research',
      'route': $40_STATE_KEY,
    }
  },
  {
    'has': {
      'text': 'Errors',
      'route': 'default-errors-view'
    }
  },
  {
    'has': {
      'text': 'Help',
      'route': 'help-dev-install'
    },
  },
  powerSignInLinkState
];

export const authAppBarLinksState: TStateAppbar['items'] = [
  {
    'has': {
      'text': 'Research',
      'route':  $40_STATE_KEY,
    }
  },
  {
    'has': {
      'text': 'Errors',
      'route': 'default-errors-view'
    }
  },
  {
    'has': {
      'text': 'Help',
      'route': 'help-dev-install'
    },
  },
  authenticatedLinkState
];

Config.register('state', '44', $44_STATE_KEY);
/** Page state for development installation form. @id 44 */
const devInstallPageState: TStatePage = {
  '_id': '44',
  '_key': $44_STATE_KEY,
  'content': '$form:devInstall:dev-install',
  'layout': 'layout_default',
  'appbar': {
    'items': [
      {
        'has': {
          'text': 'Research',
          'route':  $40_STATE_KEY,
        }
      },
      {
        'has': {
          'text': 'Client errors',
          'route': 'default-errors-view'
        }
      },
      {
        'has': {
          'text': 'Help',
          'route': 'help-dev-install'
        },
      },
      {
        'type': 'icon',
        'has': {
          'icon': 'dark_mode_outline',
          'onclickHandle': `tuberCallbacks.$44_C_1`,
        }
      }
    ],
  },
};

export default devInstallPageState;

/** Dark theme mode state page for development installation. @id 44 */
export const $44DarkThemeMode: TStatePage = {
  ...devInstallPageState,
  'appbar': {
    'items': [
      {
        'has': {
          'text': 'Research',
          'route':  $40_STATE_KEY,
        }
      },
      {
        'has': {
          'text': 'Client errors',
          'route': 'default-errors-view'
        }
      },
      {
        'has': {
          'text': 'Help',
          'route': 'help-dev-install'
        },
      },
      {
        'type': 'icon',
        'has': {
          'icon': 'wb_sunny_outline',
          'onclickHandle': `tuberCallbacks.$44_C_1`,
        }
      }
    ],
  },
};

/**
 * Get the page state development, testing, and installation.
 *
 * @param usr user retrieved from the decode JWT token.
 * @param mode theme mode
 * @returns page state
 * @id 44
 */
export function get_dev_install_page_state(usr?: TCipheredUser): TStatePage {
  return {
    ...devInstallPageState,
    'appbar': {
      ...devInstallPageState.appbar,
      'items': [
        ...(devInstallPageState.appbar 
          && devInstallPageState.appbar.items
          || []
        ),
        usr ? powerLogoutLinkState : powerSignInLinkState,
      ]
    },
  };
}

/**
 * [ __Dark themed__ ] page state for development and installation.
 *
 * @param usr user object decode from user token
 * @returns page state
 * @id 44
 */
export function get_44_dark_theme_mode (usr?: TCipheredUser): TStatePage {
  return {
    ...$44DarkThemeMode,
    'appbar': {
      ...$44DarkThemeMode.appbar,
      'items': [
        ...($44DarkThemeMode.appbar 
          && $44DarkThemeMode.appbar.items
          || []
        ),
        usr ? $66DarkThemeMode : $67DarkThemeMode,
      ]
    },
  };
}
