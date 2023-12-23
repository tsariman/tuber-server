import {
  $63_STATE_KEY,
  THEME_LIGHT_APP_BAR_ICON_COLOR as ICON_COLOR,
} from '../../constants'
import { TStateAppBar } from '../../common.types'
import Config from '../../config'
import { powerSignInLinkState } from '../nav.link'

Config.register('state', '63', $63_STATE_KEY)
/** State for research page app bar. @id 63 */
const researchPageAppBarState: TStateAppBar = {
  '_id': '63',
  '_key': $63_STATE_KEY,
  'appbarStyle': 'middle_search',
  'items': [ powerSignInLinkState ],
  'searchFieldProps': {
    'sx': { 'backgroundColor': 'transparent' }
  },
  'inputBaseProps': {
    'id': 'search-query',
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
}

export default researchPageAppBarState

/** Dark theme mode for research page app bar state. @id 63 */
export const $63DarkThemeMode: TStateAppBar = {
  ...researchPageAppBarState,
}