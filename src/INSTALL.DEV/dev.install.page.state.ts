import { getAuthenticationLinkJson } from 'src/state/nav.link'
import IStatePage from '../../../tuber-client/src/controllers/interfaces/IStatePage'

const devInstallPage: IStatePage = {
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
devInstallPage.appBar?.items?.push(getAuthenticationLinkJson())

export default devInstallPage