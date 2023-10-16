import { defaultAppBarState } from '../../state/default.content'
import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'

export const loginPage: IStatePage = {
  '_key': 'login',
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
