import { defaultAppBarState } from '../default.content'
import Config from '../../config'
import * as C from '../../constants'
import researchPageState from './research.page.state'
import DEV_STATE_PAGES, {
  DEV_STATE_PAGES_THEME_DARK
} from '../../DEV/page'
import adminReadablePageState from '../../ADMIN/page/admin.readable.page.state'
import { TStateAllPages, TStatePage, TThemeMode } from '../../common.types'
import { themed } from '../../business.logic'

Config.register('state', '42', C.$42_STATE_KEY)
/** Login page state @id 42 */
export const loginPageState: TStatePage = {
  '_id': '42',
  '_key': C.$42_STATE_KEY,
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

/** Dark theme mode login page state @id 42 */
export const $42DarkThemeMode: TStatePage = {
  ...loginPageState,
}

export const STATE_PAGES_THEME_DARK: TStateAllPages = {
  [C.$42_STATE_KEY]: $42DarkThemeMode,
  ...(Config.DEV ? DEV_STATE_PAGES_THEME_DARK : {})
}

export const STATE_PAGES: TStateAllPages = {
  [C.$40_STATE_KEY]: researchPageState,
  [C.$42_STATE_KEY]: loginPageState,
  ...(Config.DEV ? DEV_STATE_PAGES : {})
}

// [TODO] Wrap in a conditional to check if the user is an admin
STATE_PAGES[C.$53_STATE_KEY] = adminReadablePageState

/**
 * __`[user theme]`__ Get a page state by key and theme mode.
 *
 * @param key page key
 * @param mode theme mode
 * @returns page state
 */
export function get_page_state(key: string, mode?: TThemeMode): TStatePage {
  const lightState = STATE_PAGES[key]
  const darkState = STATE_PAGES_THEME_DARK[key]
  return themed(lightState, darkState, mode)
}
