import { authenticatedLinkState, powerLinkState } from '../../state/nav.link'
import Config from '../../config'
import { $40_STATE_KEY, $44_STATE_KEY } from '../../constants'
import { TStateAppBar, TStatePage } from '../../common.types'

export const appBarLinksState: TStateAppBar['items'] = [
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
  powerLinkState
]

export const authAppBarLinksState: TStateAppBar['items'] = [
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
]

Config.register('state', '44', $44_STATE_KEY)
/** Page state for development installation form. @id 44 */
const devInstallPageState: TStatePage = {
  '_id': '44',
  '_key': $44_STATE_KEY,
  'content': '$form:devInstall:dev-install',
  'layout': 'layout_default',
  'appBar': {
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
}

export default devInstallPageState

/** Dark theme mode page state for development installation form. @id 44 */
export const $44DarkThemeMode: TStatePage = {
  ...devInstallPageState,
  'appBar': {
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
}