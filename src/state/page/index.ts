import { defaultAppBarState } from '../default.content'
import Config from '../../config'
import * as C from '../../constants'
import researchPageState, { $40DarkThemeMode } from './research.page.state'
import DEV_STATE_PAGES, {
  DEV_STATE_PAGES_THEME_DARK
} from '../../DEV/page'
import adminReadablePageState from '../../ADMIN/page/admin.readable.page.state'
import { TStateAllPages, TStatePage, TThemeMode } from '../../common.types'
import { remove_form_suffix, themed } from '../../business.logic'
import { $51DarkThemeMode } from './listing.page.state'

Config.register('state', '42', C.$42_STATE_KEY)
/** Sign in page state @id 42 */
export const signInPageState: TStatePage = {
  '_id': '42',
  '_key': C.$42_STATE_KEY,
  'content': `$form : ${remove_form_suffix(C.$41_STATE_KEY)} : ${C.EP_AUTHENTICATE}`,
  'layout': 'layout_centered_no_scroll',
  'appbar': {
    'appbarStyle': 'mini',
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

/** Dark theme mode sign in page state @id 42 */
export const $42DarkThemeMode: TStatePage = {
  ...signInPageState,
}

export const STATE_PAGES_THEME_DARK: TStateAllPages = {
  [C.$40_STATE_KEY]: $40DarkThemeMode,
  [C.$42_STATE_KEY]: $42DarkThemeMode,
  [C.$51_STATE_KEY]: $51DarkThemeMode,
  ...(Config.DEV ? DEV_STATE_PAGES_THEME_DARK : {})
}

export const STATE_PAGES: TStateAllPages = {
  [C.$40_STATE_KEY]: researchPageState,
  [C.$42_STATE_KEY]: signInPageState,
  [C.$51_STATE_KEY]: researchPageState,
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
