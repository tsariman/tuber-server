import { defaultAppBarState } from '../default.content'
import Config from '../../config'
import { register } from '../../business.logic/registry'
import {
  EP_AUTH,
  type TStateAllPages,
  type TStatePage
} from '@tuber/shared'
import researchPageState, {
  $40DarkThemeMode,
  $70DarkThemeMode,
  listingPageState
} from './research.page.state'
import DEV_STATE_PAGES, {
  DEV_STATE_PAGES_THEME_DARK,
} from '../../dev/page'
import adminReadablePageState from '../../ADMIN/page/admin.readable.page.state'
import {
  clone_with_descriptors,
  remove_form_suffix,
} from '../../business.logic'
import chippedListingPageState, {
$51DarkThemeMode,
} from './listing.page.state'
import { homeLinkState } from '../nav.link'
import STATE_KEY from '../../business.logic/state.key'
import accountPageState, { $80DarkThemeMode } from './account.page.state'
import { TContextualUser } from '../../schema/user'
import Access from '../../business.logic/security/Access'
import { IBootstrapThemed } from '../_state.common.types'
import { warn } from '../../utility/logging'

const $40 = STATE_KEY['40']
const $51 = STATE_KEY['51']
const $70 = STATE_KEY['70']
const $53 = STATE_KEY['53']
const $41 = STATE_KEY['41']
const $42 = STATE_KEY['42']
const $80 = STATE_KEY['80']
const $83 = STATE_KEY['83']

register('state', '42', $42)
/** Sign in page state @id 42 */
export const signInPageState: TStatePage = {
  '_id': '42',
  '_key': $42,
  'content': `$form : ${remove_form_suffix($41)} : ${EP_AUTH.IN}`,
  'layout': 'layout_centered_no_scroll',
  'appbar': {
    'appbarStyle': 'mini',
    'props': defaultAppBarState.props,
    'items': [ homeLinkState ]
  },
  'hideDrawer': true
}

/** Dark theme mode sign in page state @id 42 */
export const $42DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(signInPageState)
  return base
})()

/**
 * Get a generic "not found" page state.
 * @param id page id
 * @param key page key
 * @returns generic "not found" page state
 * @id 83
 */
export const get_generic_not_found_page_state = (key?: string): TStatePage => ({
  '_id': '83',
  '_key': key ?? $83,
  'appbarInherited': 'default-notfound',
  'contentInherited': 'default-notfound',
  'layout': 'layout_centered',
  'data': { 'message': `Page not found!` },
})

/** All pages state for dark theme mode. */
export const STATE_PAGES_DARK: TStateAllPages = {
  [$40]: $40DarkThemeMode,
  [$42]: $42DarkThemeMode,
  [$51]: $51DarkThemeMode,
  [$70]: $70DarkThemeMode,

  // TODO: For a page to be accessible in dark mode, you must insert it here.

  ...(Config.DEV ? DEV_STATE_PAGES_THEME_DARK : {})
}

/** All pages state. */
export const STATE_PAGES: TStateAllPages = {
  [$40]: researchPageState,
  [$42]: signInPageState,
  [$51]: chippedListingPageState,
  [$70]: listingPageState,

  // TODO: For a page to be accessible in light mode, you must insert it here.

  ...(Config.DEV ? DEV_STATE_PAGES : {})
}

/** Get page state based on user context */
export const get_contextualized_page_state = (
  key: string,
  usr?: TContextualUser
): IBootstrapThemed<TStatePage> => {
  const contextuaStatePages = clone_with_descriptors(STATE_PAGES)
  const contextuaStatePagesDark = clone_with_descriptors(STATE_PAGES_DARK)
  if (Access.the(usr).hasClearance('free').then) {
    contextuaStatePages[$80] = accountPageState
    contextuaStatePagesDark[$80] = $80DarkThemeMode
  }
  if (contextuaStatePages[key] && contextuaStatePagesDark[key]) {
    // If the requested page exists, return it contextualized to the user
    return {
      'light': contextuaStatePages[key],
      'dark': contextuaStatePagesDark[key]
    }
  }
  // If the requested page doesn't exist, return a generic not found page
  warn(`Page state for key '${key}' not found. Returning generic not found page state.`)
  return {
    'light': get_generic_not_found_page_state(key),
    'dark': get_generic_not_found_page_state(key)
  }
}

// [TODO] Wrap in a conditional to check if the user is an admin
STATE_PAGES[$53] = adminReadablePageState
