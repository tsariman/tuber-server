import { authenticatedLinkJson, powerLinkJson } from 'src/state/nav.link'
import IStateAppBar from '../../../tuber-client/src/controllers/interfaces/IStateAppBar'
import IStatePage from '../../../tuber-client/src/controllers/interfaces/IStatePage'

export const appBarLinksJson: IStateAppBar['items'] = [
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
  powerLinkJson
]

export const authAppBarLinksJson: IStateAppBar['items'] = [
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
  authenticatedLinkJson
]

const devInstallPageJson: IStatePage = {
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
// devInstallPage.appBar?.items?.push(getAuthenticationLinkJson())

export default devInstallPageJson