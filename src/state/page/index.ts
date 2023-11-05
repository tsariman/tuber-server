import { defaultAppBarState } from '../default.content'
import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'
import Config from '../../config'
import { $42_KEY, $48_KEY } from '../../constants'

Config.register('state', '42', $42_KEY)
/** @id 42 */
export const loginPage: IStatePage = {
  '_id': '42',
  '_key': $42_KEY,
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

Config.register('state', '48', $48_KEY)
/** @id 48 */