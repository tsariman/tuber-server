import Config from 'src/config'
import IStateAllPages from '../../../../tuber-client/src/controllers/interfaces/IStateAllPages'
import researchPageJson from './research.page.state'
import devInstallPage from 'src/INSTALL.DEV/dev.install.page.state'
import devSignedInAppBar from 'src/INSTALL.DEV/dev.signedin-appbar.page.state'
import appBar from 'src/state/default.content/default.appBar.state'

const pages: IStateAllPages = {  }

pages['login'] = {
  'content': '$form:login:users',
  'layout': 'layout_centered_no_scroll',
  'appBar': {
    'appBarStyle': 'mini',
    'props': appBar.props,
    'items': [
      {
        'has': {
          'text': 'Home',
          'route': '/'
        }
      }
    ]
  },
  'hideDrawer': true
}

if (Config.DEV) {
  pages['dev-install'] = devInstallPage
  pages['dev-signedin-appbar'] = devSignedInAppBar
  pages['research-app'] = researchPageJson
}

export default pages