import { TStatePage } from '../../common.types'
import Config from '../../config'
import { $53_STATE_KEY } from '../../constants'

Config.register('state', '53', $53_STATE_KEY)
/** @id 53 */
const adminReadablePageState: TStatePage = {
  '_id': '53',
  '_key': $53_STATE_KEY,
  'content': '$webapp : adminReadable',
  'layout': 'layout_md',
  'appbar': {
    'appbarStyle': 'middle_search',
    'items': [
      {
        'has': {
          'text': 'Home',
          'route': '/'
        }
      }
    ],
    'inputBaseProps': {
      'id': 'filter-readable',
      'placeholder': 'Filter readable text ...',
      'inputProps': { 'aria-label': 'Readable text' },
    },

    'searchFieldIcon': {
      'icon': 'filter_none_outline',
      'iconProps': {
        'sx': { 'color': 'grey.500' }
      }
    },
    'searchFieldIconButton': {
      'has': {
        'icon': 'search_outline',
        'onclickHandle': 'tuberCallbacks.$53_C_1'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'filter readable text'
    }
  },
  'hideDrawer': true
}

export default adminReadablePageState

export const $53DarkThemeMode: TStatePage = {
  ...adminReadablePageState,
}