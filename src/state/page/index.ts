import { defaultAppBarState } from '../default.content'
import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'
import Config from '../../config'
import * as C from '../../constants'
import researchPageState from './research.page.state'
import {
  devSetAuthorizationKeyPageState,
  devSetAuthorizationUrlPageState,
  devTestThumbnailPageState
} from 'src/DEV/page'
import IStateAllPages from '../../../../tuber-client/src/controllers/interfaces/IStateAllPages'
import devInstallPageState from 'src/DEV/page/dev.install.page.state'
import devSignedInPageState from 'src/DEV/page/dev.signedin-appbar.page.state'

Config.register('state', '42', C.$42_KEY)
/** @id 42 */
export const loginPageState: IStatePage = {
  '_id': '42',
  '_key': C.$42_KEY,
  'content': '$form : login : authentification',
  'layout': 'layout_centered_no_scroll',
  'appBar': {
    'appBarStyle': 'mini',
    'props': defaultAppBarState.props,
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

const STATE_PAGES: IStateAllPages = {
  [C.$40_KEY]: researchPageState,
  [C.$42_KEY]: loginPageState,
}

if (Config.DEV) {
  STATE_PAGES[C.$43_KEY] = devSignedInPageState
  STATE_PAGES[C.$44_KEY] = devInstallPageState
  STATE_PAGES[C.$46_KEY] = devTestThumbnailPageState
  STATE_PAGES[C.$48_KEY] = devSetAuthorizationKeyPageState
  STATE_PAGES[C.$51_KEY] = devSetAuthorizationUrlPageState
}

export default STATE_PAGES