import { authenticatedLinkState, powerLinkState } from '../state/nav.link'
import IStateAppBar from '../../../tuber-client/src/controllers/interfaces/IStateAppBar'
import IStatePage from '../../../tuber-client/src/controllers/interfaces/IStatePage'

export const appBarLinksState: IStateAppBar['items'] = [
  {
    'has': {
      'text': 'Research',
      'route': 'research-app'
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
      'route': 'research-app'
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

const devInstallPageState: IStatePage = {
  '_key': 'dev-install',
  'content': '$form:devInstall:dev-install',
  'layout': 'layout_default',
  'appBar': {
    'items': [
      {
        'has': {
          'text': 'Research',
          'route': 'research-app'
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