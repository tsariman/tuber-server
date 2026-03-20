import { register } from '../../business.logic/registry'
import STATE_KEY from '../../business.logic/state.key'
import type { TStateAllPages, TStatePage } from '@tuber/shared'
import { defaultAppBarState } from '../../state/default.content'
import devInstallPageState, {
  $44DarkThemeMode,
  get_44_dark_theme_mode,
  get_dev_install_page_state
} from './dev.install.page.state'
import { TThemeMode } from '../../common.types'
import devSignedInPageState, {
  $43DarkThemeMode
} from './dev.signedin-appbar.page.state'
import {
  clone_with_descriptors,
  get_state_key as key,
  remove_form_suffix,
  themed
} from '../../business.logic'
import { TContextualUser } from '../../schema/user'
import { homeLinkState } from '../../state/nav.link'

const $40 = STATE_KEY['40']
const $43 = STATE_KEY['43']
const $44 = STATE_KEY['44']
const $45 = STATE_KEY['45']
const $46 = STATE_KEY['46']
const $48 = STATE_KEY['48']
const $54 = STATE_KEY['54']
const $56 = STATE_KEY['56']
const $57 = STATE_KEY['57']
const $58 = STATE_KEY['58']
const $59 = STATE_KEY['59']
const $60 = STATE_KEY['60']
const $61 = STATE_KEY['61']
const $62 = STATE_KEY['62']

register('state', '46', $46)
/** @id 46 */
export const devTestThumbnailPageState: TStatePage = {
  '_id': '46',
  '_key': $46,
  'appbar': {
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
          'route': $44
        }
      }
    ],
    'toolbarProps': { 'variant': 'dense' }
  },
  'content': `$form : ${remove_form_suffix($45)}`,
  'layout': 'layout_centered_no_scroll'
}

export const $46DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(devTestThumbnailPageState)
  return base
})()

register('state', '56', $56)
/** @id 56 */
export const devTestRumbleRegexpPageState: TStatePage = {
  '_id': '56',
  '_key': $56,
  'content': `$form : ${remove_form_suffix($54)} : test-rumble-regexp`,
  'layout': 'layout_centered_no_scroll',
  'appbar': {
    'appbarStyle': 'mini',
    'props': defaultAppBarState.props,
    'items': [
      {
        'has': {
          'text': 'Errors',
          'route': 'default-errors-view'
        }
      },
      homeLinkState
    ]
  },
}

export const $56DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(devTestRumbleRegexpPageState)
  return base
})()

register('state', '58', $58)
/** @id 58 */
export const devTestUnknownRegexpPageState: TStatePage = {
  '_id': '58',
  '_key': $58,
  'content': `$form : ${remove_form_suffix($57)} : test-unknown-regexp`,
  'layout': 'layout_centered_no_scroll',
  'appbar': {
    'appbarStyle': 'mini',
    'props': defaultAppBarState.props,
    'items': [
      {
        'has': {
          'text': 'Errors',
          'route': 'default-errors-view'
        }
      },
      homeLinkState
    ]
  },
}

export const $58DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(devTestUnknownRegexpPageState)
  return base
})()

register('state', '59', $59)
/** @id 59 */
export const devTwitchInputClientIdPageState: TStatePage = {
  '_id': '59',
  '_key': $59,
  'content': `$form : ${remove_form_suffix($60)} : save-twitch-client-id`,
  'layout': 'layout_centered_no_scroll',
  'appbar': {
    'appbarStyle': 'mini',
    'props': defaultAppBarState.props,
    'items': [
      {
        'has': {
          'text': 'Errors',
          'route': 'default-errors-view'
        }
      },
      homeLinkState
    ]
  },
}

export const $59DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(devTwitchInputClientIdPageState)
  return base
})()

register('state', '61', $61)
/** @id 61 */
export const devSaveConfigValuePageState: TStatePage = {
  '_id': '61',
  '_key': $61,
  'content': `$form : ${remove_form_suffix($62)} : ${$61}`,
  'layout': 'layout_centered_no_scroll',
  'appbar': {
    'appbarStyle': 'mini',
    'props': defaultAppBarState.props,
    'items': [
      {
        'has': {
          'text': 'Errors',
          'route': 'default-errors-view'
        }
      },
      homeLinkState
    ]
  },
}

export const $61DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(devSaveConfigValuePageState)
  return base
})()

register('state', '48', $48)
/** @id 48 */
export const devResearchErrorsViewPageState: TStatePage = {
  '_id': '48',
  '_key': $48,
  'content': '$view : default_errors_page_view',
  'layout': 'layout_none_no_appbar',
  'appbar': {
    'items': [
      {
        'has': {
          'text': 'Back',
          'route': $40
        }
      }
    ]
  }
}

export const $48DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(devResearchErrorsViewPageState)
  return base
})()

/** @deprecated */
export function dev_bootstrap_pages_light_state(
  usr?: TContextualUser
): TStateAllPages {
  const pages: TStateAllPages = {}
  pages[key(devInstallPageState)] = get_dev_install_page_state(usr)

  // TODO: Don't forget to insert light theme mode state for each page

  return pages
}

/** @deprecated */
export function dev_bootstrap_pages_dark_state(
  usr?: TContextualUser
): TStateAllPages {
  const pages: TStateAllPages = {}
  pages[key(devInstallPageState)] = get_44_dark_theme_mode(usr)

  // TODO: Don't forget to insert dark theme mode state for each page

  return pages
}

/**
 * Get the page state for development, testing, and installation.
 *
 * @param list of all pages
 * @param themeMode theme mode
 * @returns void
 *
 * @deprecated
 */
export function dev_bootstrap_pages_state(
  usr?: TContextualUser,
  themeMode?: TThemeMode
): TStateAllPages {
  const pages: TStateAllPages = {}
  const light = get_dev_install_page_state(usr)
  const dark = get_44_dark_theme_mode(usr)
  pages[key(devInstallPageState)] = themed(light, dark, themeMode)

  return pages
}

const DEV_STATE_PAGES: TStateAllPages = {
  [$43]: devSignedInPageState,
  [$44]: devInstallPageState,
  [$46]: devTestThumbnailPageState,
  [$48]: devResearchErrorsViewPageState,
  [$56]: devTestRumbleRegexpPageState,
  [$58]: devTestUnknownRegexpPageState,
  [$59]: devTwitchInputClientIdPageState,
  [$61]: devSaveConfigValuePageState,
}

export default DEV_STATE_PAGES

export const DEV_STATE_PAGES_THEME_DARK: TStateAllPages = {
  [$43]: $43DarkThemeMode,
  [$44]: $44DarkThemeMode,
  [$46]: $46DarkThemeMode,
  [$48]: $48DarkThemeMode,
  [$56]: $56DarkThemeMode,
  [$58]: $58DarkThemeMode,
  [$59]: $59DarkThemeMode,
  [$61]: $61DarkThemeMode,
}
