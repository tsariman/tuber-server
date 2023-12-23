import { TStatePage } from '../../common.types'
import Config from '../../config'
import { $51_STATE_KEY } from '../../constants'

Config.register('state', '51', $51_STATE_KEY)
/** Page state for listing app. @id 51 */
const listingPageState = {
  '_id': '51',
  '_key': $51_STATE_KEY,
  'content': '$webapp : tubeResearcher : listing',
  'appbar': {
    'appbarStyle': 'middle_search',
    'items': [ ],
    'inputBaseProps': {
      'id': 'filter-listing',
      'placeholder': 'Filter ...',
      'inputProps': { 'aria-label': 'Search Bookmarks' },
    },
    'inputBaseChips': [

      // Example of a chip
      {
        'label': 'Default',
        'color': 'primary',
        'variant': 'filled',
        'ondeleteHandle': 'tuberCallbacks.$51_C_1'
      }
    ],
    'searchFieldIcon': {
      'icon': 'public_outline',
      'iconProps': {
        'sx': { 'color': '#fff' }
      }
    },
    'searchFieldIconButton': {
      'has': {
        'icon': 'search_outline',
        'onclickHandle': 'tuberCallbacks.appbarFilterBookmarks'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'submit search query'
    }
  },
  'layout': 'layout_none_no_appbar',
} as TStatePage

export default listingPageState

/** Dark theme mode for listing page state. @id 51 */
export const $51DarkThemeMode: TStatePage = {
  ...listingPageState,
}