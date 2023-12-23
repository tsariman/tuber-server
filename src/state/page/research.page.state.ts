import { TStatePage } from '../../common.types'
import Config from '../../config'
import {
  $40_STATE_KEY,
  THEME_LIGHT_APP_BAR_ICON_COLOR as ICON_COLOR,
} from '../../constants'

Config.register('state', '40', $40_STATE_KEY)
/** Page state for research page app. @id 40 */
const researchPageState: TStatePage = {
  '_id': '40',
  '_key': $40_STATE_KEY,
  'content': '$webapp : tubeResearcher : bookmarks',
  'appbar': {
    'appbarStyle': 'middle_search',
    'items': [ ],
    'inputBaseProps': {
      'id': 'video-url',
      'placeholder': 'Search ...',
      'inputProps': { 'aria-label': 'Search Bookmarks' },
    },
    'searchFieldIcon': {
      'icon': 'public_outline',
      'iconProps': {
        'sx': { 'color': ICON_COLOR }
      }
    },
    'searchFieldIconButton': {
      'has': {
        'icon': 'search_outline',
        'onclickHandle': 'tuberCallbacks.appbarSearchBookmarks'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'submit search query'
    }
  },
  'layout': 'layout_none_no_appbar',
}

export default researchPageState

/** Dark theme mode for research page state. @id 40 */
export const $40DarkThemeMode: TStatePage = {
  ...researchPageState,
}