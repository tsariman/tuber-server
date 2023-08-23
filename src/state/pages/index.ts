import { defaultAppBarJson } from 'src/state/default.content'
import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'

export const loginPage: IStatePage = {
  'content': '$form:login:users',
  'layout': 'layout_centered_no_scroll',
  'appBar': {
    'appBarStyle': 'mini',
    'props': defaultAppBarJson.props,
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
