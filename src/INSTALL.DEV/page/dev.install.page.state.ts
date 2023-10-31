import { authenticatedLinkState, powerLinkState } from '../../state/nav.link'
import IStateAppBar from '../../../../tuber-client/src/controllers/interfaces/IStateAppBar'
import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'
import Config from '../../config'
import { $40_KEY } from 'src/state/page/research.page.state'

export const appBarLinksState: IStateAppBar['items'] = [
  {
    'has': {
      'text': 'Research',
      'route': $40_KEY,
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
  powerLinkState
]

export const authAppBarLinksState: IStateAppBar['items'] = [
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
  authenticatedLinkState
]

const $44 = '44'
export const $44_KEY = 'dev-install'
Config.registre('state', $44, $44_KEY)
/** @id 44 */
const devInstallPageState: IStatePage = {
  '_id': $44,
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