import { authenticatedLinkState, powerLinkState } from '../../state/nav.link'
import Config from '../../config'
import { $40_KEY, $44_KEY } from '../../constants'
import { TStateAppBar, TStatePage } from '../../common.types'

export const appBarLinksState: TStateAppBar['items'] = [
  {
    'has': {
      'text': 'Research',
      'route': $40_KEY,
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
      'route':  $40_KEY,
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

Config.register('state', '44', $44_KEY)
/** @id 44 */
const devInstallPageState: TStatePage = {
  '_id': '44',
  '_key': $44_KEY,
  'content': '$form:devInstall:dev-install',
  'layout': 'layout_default',
  'appBar': {
    'items': [
      {
        'has': {
          'text': 'Research',
          'route':  $40_KEY,
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
    ],
  },
}

export default devInstallPageState