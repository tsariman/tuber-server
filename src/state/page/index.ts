import { defaultAppBarState } from '../default.content'
import Config from '../../config'
import * as C from '../../constants'
import researchPageState from './research.page.state'
import DEV_STATE_PAGES from '../../DEV/page'
import adminReadablePageState from '../../ADMIN/page/admin.readable.page.state'
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

const STATE_ALL_PAGES: TStateAllPages = {
  ...STATE_PAGES,
  ...(Config.DEV ? DEV_STATE_PAGES : {})
}

export default STATE_ALL_PAGES