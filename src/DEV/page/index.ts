import { remove_form_suffix } from 'src/state/form/_forms.business.logic'
import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'
import Config from '../../config'
import * as C from '../../constants'
import { defaultAppBarState } from '../../state/default.content'
import IStateAllPages from '../../../../tuber-client/src/controllers/interfaces/IStateAllPages'
import devInstallPageState from './dev.install.page.state'

Config.register('state', '46', C.$46_KEY)
/** @id 46 */
export const devTestThumbnailPageState: IStatePage = {
  '_id': '46',
  '_key': C.$46_KEY,
  'appBar': {
    'items': [
      {
        'has': {
          'text': 'Client errors',
          'route': 'default-errors-view'
        }
      },
      {
        'has': {
          'text': 'Back',
          'route': C.$44_KEY
        }
      }
    ],
    'toolbarProps': {
      'variant': 'dense'
    }
  },
  'content': `$form : ${remove_form_suffix(C.$45_KEY)}`,
  'layout': 'layout_centered_no_scroll'
}

Config.register('state', '48', C.$48_KEY)
/** @id 48 */
export const devSetAuthorizationKeyPageState: IStatePage = {
  '_id': '48',
  '_key': C.$48_KEY,
  'content': `$form : ${remove_form_suffix(C.$49_KEY)} : save-authorization-key`,
  'layout': 'layout_centered_no_scroll',
  'appBar': {
    'appBarStyle': 'mini',
    'props': defaultAppBarState.props,
    'items': [
      {
        'has': {
          'text': 'Errors',
          'route': 'default-errors-view'
        }
      },
      {
        'has': {
          'text': 'Home',
          'route': '/'
        }
      }
    ]
  },
}

Config.register('state', '51', C.$51_KEY)
/** @id 51 */
export const devSetAuthorizationUrlPageState: IStatePage = {
  '_id': '51',
  '_key': C.$51_KEY,
  'content': `$form : ${remove_form_suffix(C.$50_KEY)} : save-authorization-url`,
  'layout': 'layout_centered_no_scroll',
  'appBar': {
    'appBarStyle': 'mini',
    'props': defaultAppBarState.props,
    'items': [
      {
        'has': {
          'text': 'Errors',
          'route': 'default-errors-view'
        }
      },
      {
        'has': {
          'text': 'Home',
          'route': '/'
        }
      }
    ]
  },
}

const DEV_STATE_PAGES: IStateAllPages = {
  [C.$44_KEY]: devInstallPageState,
  [C.$46_KEY]: devTestThumbnailPageState,
  [C.$48_KEY]: devSetAuthorizationKeyPageState,
  [C.$51_KEY]: devSetAuthorizationUrlPageState,
}

export default DEV_STATE_PAGES