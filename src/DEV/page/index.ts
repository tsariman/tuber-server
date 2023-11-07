import { remove_form_suffix } from 'src/state/form/_forms.business.logic'
import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'
import Config from '../../config'
import { $44_KEY, $45_KEY, $46_KEY, $48_KEY, $49_KEY } from '../../constants'
import { defaultAppBarState } from '../../state/default.content'

Config.register('state', '46', $46_KEY)
export const devTestThumbnailPageState: IStatePage = {
  '_id': '46',
  '_key': $46_KEY,
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
          'route': $44_KEY
        }
      }
    ],
    'toolbarProps': {
      'variant': 'dense'
    }
  },
  'content': `$form : ${remove_form_suffix($45_KEY)}`,
  'layout': 'layout_centered_no_scroll'
}
Config.stateMapSet($46_KEY, devTestThumbnailPageState)

Config.register('state', '48', $48_KEY)
/** @id 48 */
export const devSetAuthorizationPageState: IStatePage = {
  '_id': '48',
  '_key': $48_KEY,
  'content': `$form : ${remove_form_suffix($49_KEY)} : authorizations`,
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
Config.stateMapSet($48_KEY, devSetAuthorizationPageState)