import { TStatePage } from '../../common.types'
import Config from '../../config'
import { $55_STATE_KEY } from '../../constants'

Config.register('state', '55', $55_STATE_KEY)
/** @id 55 */
const adminConfigPageState: TStatePage = {
  '_id': '55',
  '_key': $55_STATE_KEY,
  'content': '$webapp : config',
  'appbar': {
    'appbarStyle': 'middle_search',
    'items': [ ],
    'inputBaseProps': {
      'id': 'video-url',
      'placeholder': 'Filter ...',
      'inputProps': { 'aria-label': 'Configuration filter' },
    },
    'searchFieldIcon': {
      'icon': 'alternate_email_outline',
      'iconProps': {
        'sx': { 'color': 'grey.500' }
      }
    },
    'searchFieldIconButton': {
      'has': {
        'icon': 'search_outline',
        'onclickHandle': 'tuberCallbacks.$55_C_1'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'Filter configurations'
    }
  },
  'layout': 'layout_md',
  'meta': {
    'endpoint': 'bookmarks'
  }
}

export default adminConfigPageState

export const $55DarkThemeMode: TStatePage = {
  ...adminConfigPageState,
}