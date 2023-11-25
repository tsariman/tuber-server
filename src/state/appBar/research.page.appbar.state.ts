import {
  $63_KEY,
  THEME_LIGHT_APP_BAR_ICON_COLOR as ICON_COLOR,
} from '../../constants'
import { TStateAppBar } from '../../common.types'
import Config from '../../config'

Config.register('state', '63', $63_KEY)
/** State for research page app bar. @id 63 */
const researchPageAppBarState: TStateAppBar = {
  '_id': '63',
  '_key': $63_KEY,
  'appBarStyle': 'middle_search',
  'items': [
    {
      'type': 'icon',
      'has': {
        'icon': 'power_settings_new_outline',
        'route': 'login'
      }
    }
  ],
  'inputBaseProps': {
    'id': 'video-url',
    'placeholder': 'Search ...',
    'inputProps': { 'aria-label': 'Search Bookmarks' },
  },
  'searchFieldIcon': {
    'icon': 'alternate_email_outline',
    'iconProps': {
      'sx': { 'color': ICON_COLOR }
    }
  },
  'searchFieldIconButton': {
    'has': {
      'icon': 'search_outline',
      'onclickHandle': 'tuberCallbacks.appBarSearchBookmarks'
    }
  },
  'searchFieldIconButtonProps': {
    'aria-label': 'load video url'
  }
}

export default researchPageAppBarState

/** Dark theme mode for research page app bar state. @id 63 */
export const $63DarkThemeMode: TStateAppBar = {
  ...researchPageAppBarState,
}