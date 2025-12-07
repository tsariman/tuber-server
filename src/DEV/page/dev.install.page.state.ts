import {
  $66DarkThemeMode,
  $67DarkThemeMode,
  authenticatedLinkState,
  powerLogoutLinkState,
  powerSignInLinkState
} from '../../state/nav.link'
import { register } from '../../business.logic/registry'
import {
  $40_STATE_KEY,
  $44_STATE_KEY,
  TStateAppbar,
  TStatePage
} from '@tuber/shared'
import { TCipheredUser } from '../../schema/user'
import {
  clone_empty,
  clone_or_default,
  clone_with_descriptors
} from '../../business.logic'

export const appbarLinksState: TStateAppbar['items'] = [
  {
    'has': {
      'text': 'Research',
      'route': $40_STATE_KEY,
    }
  },
  {
    'has': {
      'text': 'Errors',
      'route': 'default-errors-view'
    }
  },
  {
    'has': {
      'text': 'Help',
      'route': 'help-dev-install'
    },
  },
  powerSignInLinkState
]

export const authAppBarLinksState: TStateAppbar['items'] = [
  {
    'has': {
      'text': 'Research',
      'route':  $40_STATE_KEY,
    }
  },
  {
    'has': {
      'text': 'Errors',
      'route': 'default-errors-view'
    }
  },
  {
    'has': {
      'text': 'Help',
      'route': 'help-dev-install'
    },
  },
  authenticatedLinkState
]

register('state', '44', $44_STATE_KEY)
/** Page state for development installation form. @id 44 */
const devInstallPageState: TStatePage = {
  '_id': '44',
  '_key': $44_STATE_KEY,
  'content': '$form:devInstall:dev-install',
  'layout': 'layout_default',
  'appbar': {
    'items': [
      {
        'has': {
          'text': 'Research',
          'route':  $40_STATE_KEY,
        }
      },
      {
        'has': {
          'text': 'Client errors',
          'route': 'default-errors-view'
        }
      },
      {
        'has': {
          'text': 'Help',
          'route': 'help-dev-install'
        },
      },
      {
        'type': 'icon',
        'has': {
          'icon': 'dark_mode_outline',
          'onclickHandler': `tuberCallbacks.$44_C_1`,
        }
      }
    ],
  },
}

export default devInstallPageState

/** Dark theme mode state page for development installation. @id 44 */
export const $44DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(devInstallPageState)
  const appbar = clone_or_default(base.appbar, {})
  const items = clone_empty(appbar.items)
  items.push({
    'has': {
      'text': 'Research',
      'route':  $40_STATE_KEY,
    }
  })
  items.push({
    'has': {
      'text': 'Client errors',
      'route': 'default-errors-view'
    }
  })
  items.push({
    'has': {
      'text': 'Help',
      'route': 'help-dev-install'
    }
  })
  items.push({
    'type': 'icon',
    'has': {
      'icon': 'wb_sunny_outline',
      'onclickHandler': `tuberCallbacks.$44_C_1`,
    }
  })
  appbar.items = items
  base.appbar = appbar
  return base
})()

/**
 * Get the page state development, testing, and installation.
 *
 * @param usr user retrieved from the decode JWT token.
 * @param mode theme mode
 * @returns page state
 * @id 44
 */
export function get_dev_install_page_state(usr?: TCipheredUser): TStatePage {
  const clone = clone_with_descriptors(devInstallPageState)
  const appbar = clone_with_descriptors(devInstallPageState.appbar ?? {})
  const items = clone_with_descriptors(appbar.items ?? [])
  items.push(usr ? powerLogoutLinkState : powerSignInLinkState)
  appbar.items = items
  clone.appbar = appbar
  return clone
}

/**
 * [ __Dark themed__ ] page state for development and installation.
 *
 * @param usr user object decode from user token
 * @returns page state
 * @id 44
 */
export function get_44_dark_theme_mode (usr?: TCipheredUser): TStatePage {
  const clone = clone_with_descriptors($44DarkThemeMode)
  const appbar = clone_with_descriptors($44DarkThemeMode.appbar ?? {})
  const items = clone_with_descriptors(appbar.items ?? [])
  items.push(usr ? $66DarkThemeMode : $67DarkThemeMode)
  appbar.items = items
  clone.appbar = appbar
  return clone
}
