import { defaultAppBarState } from '../default.content'
import Config from '../../config'
import * as C from '../../constants'
import researchPageState from './research.page.state'
import {
  devSetAuthorizationKeyPageState,
  devSetAuthorizationUrlPageState,
  devTestThumbnailPageState
} from 'src/DEV/page'
import devInstallPageState from 'src/DEV/page/dev.install.page.state'
import devSignedInPageState from 'src/DEV/page/dev.signedin-appbar.page.state'
import adminReadablePageState from 'src/ADMIN/page/admin.readable.page.state'
import { TStateAllPages, TStatePage } from '../../common.types'

Config.register('state', '42', C.$42_KEY)
/** @id 42 */
export const loginPageState: TStatePage = {
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

const STATE_PAGES: TStateAllPages = {
  [C.$40_KEY]: researchPageState,
  [C.$42_KEY]: loginPageState,
}

// [TODO] Wrap in a conditional to check if the user is an admin
STATE_PAGES[C.$53_KEY] = adminReadablePageState

if (Config.DEV) {
  STATE_PAGES[C.$43_KEY] = devSignedInPageState
  STATE_PAGES[C.$44_KEY] = devInstallPageState
  STATE_PAGES[C.$46_KEY] = devTestThumbnailPageState
  STATE_PAGES[C.$48_KEY] = devSetAuthorizationKeyPageState
  STATE_PAGES[C.$51_KEY] = devSetAuthorizationUrlPageState
}

export default STATE_PAGES