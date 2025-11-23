import { register } from '../../business.logic/registry'
import {
  TStatePage,
  $40_STATE_KEY,
  $70_STATE_KEY,
  THEME_LIGHT_APP_BAR_ICON_COLOR as ICON_COLOR
} from '@tuber/shared'
import researchPageAppbarState, {
  $63DarkThemeMode
} from '../appbar'
import {
  $66DarkThemeMode,
  $67DarkThemeMode,
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
  clone_with_descriptors,
  create_empty_collection
} from '../../business.logic'
import { IBootstrapThemed, IStateContext } from '../_state.common.types'
import Config from '../../config'
import Access from '../../business.logic/security/Access'

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
      'placeholder': 'Search ...',
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
      const link = create_empty_collection(appbar.items)
      if (Config.DEV) {
        link.add(researchAppErrorsViewLinkState)
        if (Access.the(context.usr).can('dev_install_page.view')) {
          link.add(homeLinkState)
        }
      } else if (context.usr) {
        link.add(bookmarkAddFromUrlLinkState)
      }
      if (!context.usr) {
        link.add(createUserLinkState)
      }
      link.add(darkModeLinkState)
      link.add(context.usr ? $66DarkThemeMode : $67DarkThemeMode)
      appbar['items'] = link.items
      base['appbar'] = appbar
      return base
    })(),
    'light': (() => {
      const base = clone_with_descriptors(researchPageState)
      const appbar = clone_with_descriptors(researchPageAppbarState)
      const link = create_empty_collection(appbar.items)
      if (Config.DEV) {
        link.add(researchAppErrorsViewLinkState)
        if (Access.the(context.usr).can('dev_install_page.view')) {
          link.add(homeLinkState)
        }
      } else if (context.usr) {
        link.add(bookmarkAddFromUrlLinkState)
      }
      if (!context.usr) {
        link.add(createUserLinkState)
      }
      link.add(lightModeLinkState)
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
