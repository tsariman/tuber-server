import {
  TStatePage,
  THEME_LIGHT_APP_BAR_ICON_COLOR as ICON_COLOR
} from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { $71DarkThemeMode, listingPageAppbarState } from '../appbar'
import {
  $66DarkThemeMode,
  $67DarkThemeMode,
  bookmarkAddFromUrlLinkState,
  darkModeLinkState,
  homeLinkState,
  lightModeLinkState,
  powerLogoutLinkState,
  powerSignInLinkState,
  researchAppErrorsViewLinkState
} from '../nav.link'
import {
  clone_as_collection,
  clone_with_descriptors
} from '../../business.logic'
import { IStateContext, IBootstrapThemed } from '../_state.common.types'
import Config from '../../config'
import Access from '../../business.logic/security/Access'
import STATE_KEY from '../../business.logic/state.key'

const $51 = STATE_KEY['51']

register('state', '51', $51)
/** Page state for listing app. @id 51 */
const chippedListingPageState: TStatePage = {
  '_id': '51',
  '_key': $51,
  'title': 'Chipped Listing',
  'content': '$webapp : tubeResearcher : listing',
  'appbar': {
    'appbarStyle': 'middle_search',
    'items': [ ],
    'inputBaseProps': {
      'id': 'filter-listing',
      'placeholder': 'Filter ...',
      'inputProps': { 'aria-label': 'Search Bookmarks' },
    },
    'inputBaseChips': [

      // Example of a chip
      {
        'label': 'Default',
        'color': 'primary',
        'variant': 'filled',
        'ondeleteHandler': 'tuberCallbacks.$51_C_1'
      }
    ],
    'searchFieldIcon': {
      'icon': 'public_outline',
      'svgIconProps': {
        'sx': { 'color': ICON_COLOR }
      }
    },
    'searchFieldIconButton': {
      'has': {
        'icon': 'filter_list_outline',
        'onclickHandler': 'tuberCallbacks.appbarFilterBookmarks'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'submit search query'
    }
  },
  'layout': 'layout_none_no_appbar',
}

export default chippedListingPageState

/** Dark theme mode for listing page state. @id 51 */
export const $51DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(chippedListingPageState)
  return base
})()

/** Bootstrap-ready light and dark themed chipped listing app. @id 51 */
export const bs_chippedListingPageState = (
  context: IStateContext
): IBootstrapThemed<TStatePage> => {
  return {
    'dark': (() => {
      const base = clone_with_descriptors($51DarkThemeMode)
      const appbar = clone_with_descriptors($71DarkThemeMode)
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
      const base = clone_with_descriptors(chippedListingPageState)
      const appbar = clone_with_descriptors(listingPageAppbarState)
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
