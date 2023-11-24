import { remove_form_suffix } from 'src/state/form/_forms.business.logic'
import Config from '../../config'
import * as C from '../../constants'
import { defaultAppBarState } from '../../state/default.content'
import devInstallPageState from './dev.install.page.state'
import { TStateAllPages, TStatePage } from '../../common.types'
import devSignedInPageState from './dev.signedin-appbar.page.state'

Config.register('state', '46', C.$46_KEY)
/** @id 46 */
export const devTestThumbnailPageState: TStatePage = {
  '_id': '46',
  '_key': C.$46_KEY,
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
          'route': C.$44_KEY
        }
      }
    ],
    'toolbarProps': { 'variant': 'dense' }
  },
  'content': `$form : ${remove_form_suffix(C.$45_KEY)}`,
  'layout': 'layout_centered_no_scroll'
}

Config.register('state', '48', C.$48_KEY)
/** @id 48 */
export const devSetAuthorizationKeyPageState: TStatePage = {
  '_id': '48',
  '_key': C.$48_KEY,
  'content': `$form : ${remove_form_suffix(C.$49_KEY)} : save-authorization-key`,
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

Config.register('state', '51', C.$51_KEY)
/** @id 51 */
export const devSetAuthorizationUrlPageState: TStatePage = {
  '_id': '51',
  '_key': C.$51_KEY,
  'content': `$form : ${remove_form_suffix(C.$50_KEY)} : save-authorization-url`,
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

Config.register('state', '56', C.$56_KEY)
/** @id 56 */
export const devTestRumbleRegexpPageState: TStatePage = {
  '_id': '56',
  '_key': C.$56_KEY,
  'content': `$form : ${remove_form_suffix(C.$54_KEY)} : test-rumble-regexp`,
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

Config.register('state', '58', C.$58_KEY)
/** @id 58 */
export const devTestUnknownRegexpPageState: TStatePage = {
  '_id': '58',
  '_key': C.$58_KEY,
  'content': `$form : ${remove_form_suffix(C.$57_KEY)} : test-unknown-regexp`,
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

Config.register('state', '59', C.$59_KEY)
/** @id 59 */
export const devTwitchInputClientIdPageState: TStatePage = {
  '_id': '59',
  '_key': C.$59_KEY,
  'content': `$form : ${remove_form_suffix(C.$60_KEY)} : save-twitch-client-id`,
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

Config.register('state', '61', C.$61_KEY)
/** @id 61 */
export const devSaveConfigValuePageState: TStatePage = {
  '_id': '61',
  '_key': C.$61_KEY,
  'content': `$form : ${remove_form_suffix(C.$62_KEY)} : save-config-value`,
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

const DEV_STATE_PAGES: TStateAllPages = {
  [C.$43_KEY]: devSignedInPageState,
  [C.$44_KEY]: devInstallPageState,
  [C.$46_KEY]: devTestThumbnailPageState,
  [C.$48_KEY]: devSetAuthorizationKeyPageState,
  [C.$51_KEY]: devSetAuthorizationUrlPageState,
  [C.$56_KEY]: devTestRumbleRegexpPageState,
  [C.$58_KEY]: devTestUnknownRegexpPageState,
  [C.$59_KEY]: devTwitchInputClientIdPageState,
  [C.$61_KEY]: devSaveConfigValuePageState,
}

export default DEV_STATE_PAGES