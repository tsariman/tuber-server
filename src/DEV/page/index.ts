import Config from '../../config'
import * as C from '../../constants'
import { defaultAppBarState } from '../../state/default.content'
import devInstallPageState, {
  $44DarkThemeMode
} from './dev.install.page.state'
import { TStateAllPages, TStatePage } from '../../common.types'
import devSignedInPageState, {
  $43DarkThemeMode
} from './dev.signedin-appbar.page.state'
import { remove_form_suffix } from '../../business.logic'

Config.register('state', '46', C.$46_STATE_KEY)
/** @id 46 */
export const devTestThumbnailPageState: TStatePage = {
  '_id': '46',
  '_key': C.$46_STATE_KEY,
  'appBar': {
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
}

export const $46DarkThemeMode: TStatePage = {
  ...devTestThumbnailPageState,
}

Config.register('state', '48', C.$48_STATE_KEY)
/** @id 48 */
export const devSetAuthorizationKeyPageState: TStatePage = {
  '_id': '48',
  '_key': C.$48_STATE_KEY,
  'content': `$form : ${remove_form_suffix(C.$49_STATE_KEY)} : save-authorization-key`,
  'layout': 'layout_centered_no_scroll',
  'appBar': {
    'appBarStyle': 'mini',
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
}

export const $48DarkThemeMode: TStatePage = {
  ...devSetAuthorizationKeyPageState,
}

Config.register('state', '51', C.$51_STATE_KEY)
/** @id 51 */
export const devSetAuthorizationUrlPageState: TStatePage = {
  '_id': '51',
  '_key': C.$51_STATE_KEY,
  'content': `$form : ${remove_form_suffix(C.$50_STATE_KEY)} : save-authorization-url`,
  'layout': 'layout_centered_no_scroll',
  'appBar': {
    'appBarStyle': 'mini',
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
}

export const $51DarkThemeMode: TStatePage = {
  ...devSetAuthorizationUrlPageState,
}

Config.register('state', '56', C.$56_STATE_KEY)
/** @id 56 */
export const devTestRumbleRegexpPageState: TStatePage = {
  '_id': '56',
  '_key': C.$56_STATE_KEY,
  'content': `$form : ${remove_form_suffix(C.$54_STATE_KEY)} : test-rumble-regexp`,
  'layout': 'layout_centered_no_scroll',
  'appBar': {
    'appBarStyle': 'mini',
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
}

export const $56DarkThemeMode: TStatePage = {
  ...devTestRumbleRegexpPageState,
}

Config.register('state', '58', C.$58_STATE_KEY)
/** @id 58 */
export const devTestUnknownRegexpPageState: TStatePage = {
  '_id': '58',
  '_key': C.$58_STATE_KEY,
  'content': `$form : ${remove_form_suffix(C.$57_STATE_KEY)} : test-unknown-regexp`,
  'layout': 'layout_centered_no_scroll',
  'appBar': {
    'appBarStyle': 'mini',
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
}

export const $58DarkThemeMode: TStatePage = {
  ...devTestUnknownRegexpPageState,
}

Config.register('state', '59', C.$59_STATE_KEY)
/** @id 59 */
export const devTwitchInputClientIdPageState: TStatePage = {
  '_id': '59',
  '_key': C.$59_STATE_KEY,
  'content': `$form : ${remove_form_suffix(C.$60_STATE_KEY)} : save-twitch-client-id`,
  'layout': 'layout_centered_no_scroll',
  'appBar': {
    'appBarStyle': 'mini',
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
}

export const $59DarkThemeMode: TStatePage = {
  ...devTwitchInputClientIdPageState,
}

Config.register('state', '61', C.$61_STATE_KEY)
/** @id 61 */
export const devSaveConfigValuePageState: TStatePage = {
  '_id': '61',
  '_key': C.$61_STATE_KEY,
  'content': `$form : ${remove_form_suffix(C.$62_STATE_KEY)} : save-config-value`,
  'layout': 'layout_centered_no_scroll',
  'appBar': {
    'appBarStyle': 'mini',
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
}

export const $61DarkThemeMode: TStatePage = {
  ...devSaveConfigValuePageState,
}

const DEV_STATE_PAGES: TStateAllPages = {
  [C.$43_STATE_KEY]: devSignedInPageState,
  [C.$44_STATE_KEY]: devInstallPageState,
  [C.$46_STATE_KEY]: devTestThumbnailPageState,
  [C.$48_STATE_KEY]: devSetAuthorizationKeyPageState,
  [C.$51_STATE_KEY]: devSetAuthorizationUrlPageState,
  [C.$56_STATE_KEY]: devTestRumbleRegexpPageState,
  [C.$58_STATE_KEY]: devTestUnknownRegexpPageState,
  [C.$59_STATE_KEY]: devTwitchInputClientIdPageState,
  [C.$61_STATE_KEY]: devSaveConfigValuePageState,
}

export default DEV_STATE_PAGES

export const DEV_STATE_PAGES_THEME_DARK: TStateAllPages = {
  [C.$43_STATE_KEY]: $43DarkThemeMode,
  [C.$44_STATE_KEY]: $44DarkThemeMode,
  [C.$46_STATE_KEY]: $46DarkThemeMode,
  [C.$48_STATE_KEY]: $48DarkThemeMode,
  [C.$51_STATE_KEY]: $51DarkThemeMode,
  [C.$56_STATE_KEY]: $56DarkThemeMode,
  [C.$58_STATE_KEY]: $58DarkThemeMode,
  [C.$59_STATE_KEY]: $59DarkThemeMode,
  [C.$61_STATE_KEY]: $61DarkThemeMode,
}
