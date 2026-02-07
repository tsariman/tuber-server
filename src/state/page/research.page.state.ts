import { register } from '../../business.logic/registry'
import {
  TStatePage,
  $40_STATE_KEY,
  $70_STATE_KEY,
  $76_STATE_KEY,
  THEME_LIGHT_APP_BAR_ICON_COLOR as ICON_COLOR,
  TStateAppbar,
  TStateDialog
} from '@tuber/shared'
import researchPageAppbarState, {
  $63DarkThemeMode
} from '../appbar'
import {
  $66DarkThemeMode,
  $67DarkThemeMode,
  account_link_state,
  bookmarkAddFromUrlLinkState,
  createUserLinkState,
  darkModeLinkState,
  homeLinkState,
  lightModeLinkState,
  powerLogoutLinkState,
  powerSignInLinkState,
  researchAppErrorsViewLinkState,
} from '../nav.link'
import {
  clone_as_collection,
  clone_or_default,
  clone_with_descriptors,
  create_empty_collection,
  t
} from '../../business.logic'
import { IBootstrapThemed, IStateContext } from '../_state.common.types'
import Config from '../../config'
import Access from '../../business.logic/security/Access'
import { TContextualUser } from '../../schema/user'

register('state', '40', $40_STATE_KEY)
/** Page state for research page app. @id 40 */
const researchPageState: TStatePage = {
  '_id': '40',
  '_key': $40_STATE_KEY,
  'title': 'Research',
  'content': '$webapp : tubeResearcher : bookmarks',
  'appbar': {
    'appbarStyle': 'middle_search',
    'items': [ ],
    'inputBaseProps': {
      'id': 'video-url',
      'placeholder': 'Search public bookmarks…',
      'inputProps': { 'aria-label': 'Search Bookmarks' },
    },
    'searchFieldIcon': {
      'icon': 'public_outline',
      'svgIconProps': {
        'sx': { 'color': ICON_COLOR }
      }
    },
    'searchFieldIconButton': {
      'has': {
        'icon': 'search_outline',
        'onclickHandler': 'tuberCallbacks.appbarSearchBookmarks'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'submit search query'
    },
  },
  'layout': 'layout_none_no_appbar',
}

export default researchPageState

/** Dark theme mode for research page state. @id 40 */
export const $40DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(researchPageState)
  return base
})()

/** Bootstrap-ready light and dark themed research page app. @id 40 */
export const bs_researchPageState = (
  context: IStateContext
): IBootstrapThemed<TStatePage> => {
  return {
    'dark': (() => {
      const base = clone_with_descriptors($40DarkThemeMode)
      const appbar = clone_with_descriptors($63DarkThemeMode)
      _enable_search_scope(appbar, context.usr)
      const link = create_empty_collection(appbar.items)
      if (Config.DEV) {
        link.add(researchAppErrorsViewLinkState)
        if (Access.the(context.usr).can('dev_install_page.view')) {
          link.add(homeLinkState)
        }
      } else if (context.usr) {
        link.add(bookmarkAddFromUrlLinkState)
      }
      link.add(darkModeLinkState)
      if (context.usr) {
        link.add(account_link_state(context.usr))
      } else {
        link.add(createUserLinkState)
      }
      link.add(context.usr ? $66DarkThemeMode : $67DarkThemeMode)
      appbar['items'] = link.items
      base['appbar'] = appbar
      return base
    })(),
    'light': (() => {
      const base = clone_with_descriptors(researchPageState)
      const appbar = clone_with_descriptors(researchPageAppbarState)
      _enable_search_scope(appbar, context.usr)
      const link = create_empty_collection(appbar.items)
      if (Config.DEV) {
        link.add(researchAppErrorsViewLinkState)
        if (Access.the(context.usr).can('dev_install_page.view')) {
          link.add(homeLinkState)
        }
      } else if (context.usr) {
        link.add(bookmarkAddFromUrlLinkState)
      }
      link.add(lightModeLinkState)
      if (context.usr) {
        link.add(account_link_state(context.usr))
      } else {
        link.add(createUserLinkState)
      }
      link.add(context.usr ? powerLogoutLinkState : powerSignInLinkState)
      appbar.items = link.items
      base.appbar = appbar
      return base
    })()
  }
}

register('state', '70', $70_STATE_KEY)
/** Listing (research alias) page state. @id 70 */
export const listingPageState: TStatePage = (() => {
  const base = clone_with_descriptors(researchPageState)
  base['_id'] = '70'
  base['_key'] = $70_STATE_KEY
  base['title'] = 'Listing'
  return base
})()
/** Dark theme mode for listing (research alias) page state. @id 70 */
export const $70DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(listingPageState)
  return base
})()
/** Bootstrap-ready light and dark themed listing page app. @id 70 */
export const bs_listingPageState = (
  context: IStateContext
): IBootstrapThemed<TStatePage> => {
  return {
    'dark': (() => {
      const base = clone_with_descriptors($70DarkThemeMode)
      const appbar = clone_with_descriptors($63DarkThemeMode)
      _enable_search_scope(appbar, context.usr)
      const link = clone_as_collection(appbar.items)
      if (Config.DEV) {
        link.add(researchAppErrorsViewLinkState)
        if (Access.the(context.usr).can('dev_install_page.view')) {
          link.add(homeLinkState)
        }
      } else if (context.usr) {
        link.add(bookmarkAddFromUrlLinkState)
      }
      link.add(darkModeLinkState)
      link.add(context.usr ? $66DarkThemeMode : $67DarkThemeMode)
      appbar['items'] = link['items']
      base['appbar'] = appbar
      return base
    })(),
    'light': (() => {
      const base = clone_with_descriptors(listingPageState)
      const appbar = clone_with_descriptors(researchPageAppbarState)
      const link = clone_as_collection(appbar.items)
      _enable_search_scope(appbar, context.usr)
      if (Config.DEV) {
        link.add(researchAppErrorsViewLinkState)
        if (Access.the(context.usr).can('dev_install_page.view')) {
          link.add(homeLinkState)
        }
      } else if (context.usr) {
        link.add(bookmarkAddFromUrlLinkState)
      }
      link.add(lightModeLinkState)
      link.add(context.usr ? powerLogoutLinkState : powerSignInLinkState)
      appbar['items'] = link['items']
      base['appbar'] = appbar
      return base
    })()
  }
}

/**
 * Configure the search scope button based on user access.
 * If the user is not authenticated, the search scope button in the search
 * field is disabled.
 * @id CREF1
 */
const _enable_search_scope = (appbar: TStateAppbar, usr?: TContextualUser) => {
  const buttonState = clone_or_default(appbar.startAdornmentButton, {})
  // Placeholder for search scope activation logic
  if (Access.the(usr).can('toggle.search.scope')) {
    // Activate user-specific search scope
    buttonState.has ??= {}
    buttonState.has.onclickHandlerDirective = { __delete: true }
    buttonState.has.onclickHandler = 'tuberCallbacks.toggleSearchScope'
    buttonState.props ??= {}
    // buttonState.props.disabled = false
  } else {
    // Disable search scope for unauthenticated users
    buttonState.has ??= {}
    buttonState.has.onclickHandler = undefined
    buttonState.has.onclickHandlerDirective = {
      'type': '$redux_actions',
      'actions': [{
        'type': 'dialog/dialogOpenOrMount',
        'payload': {
          '_id': '76',
          '_key': $76_STATE_KEY,
          'title': 'Search Mode Unavailable',
          'content': 'To use the search mode feature, please sign in to your account.',
          'actions': [{
            'label': 'Close',
            'has': {
              get 'text'() { return t('49', 'Close') },
              'onclickHandler': 'tuberCallbacks.defaultClose'
            }
          }],
          'open': true
        } as TStateDialog
      }]
    }
    buttonState.props ??= {}
    // buttonState.props.disabled = true
  }
  appbar.startAdornmentButton = buttonState
}