import { $51_STATE_KEY, TStatePage } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { $71DarkThemeMode, listingPageAppbarState } from '../appbar'
import {
  $66DarkThemeMode,
  bookmarkAddFromUrlLinkState,
  darkModeLinkState,
  homeLinkState,
  lightModeLinkState,
  powerLogoutLinkState,
  researchAppErrorsViewLinkState
} from '../nav.link'
import {
  clone_as_collection,
  clone_with_descriptors
} from '../../business.logic'
import { IStateContext, IBootstrapThemed } from '../_state.common.types'
import Config from '../../config'

register('state', '51', $51_STATE_KEY)
/** Page state for listing app. @id 51 */
const chippedListingPageState = {
  '_id': '51',
  '_key': $51_STATE_KEY,
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
        'ondeleteHandle': 'tuberCallbacks.$51_C_1'
      }
    ],
    'searchFieldIcon': {
      'icon': 'public_outline',
      'svgIconProps': {
        'sx': { 'color': '#fff' }
      }
    },
    'searchFieldIconButton': {
      'has': {
        'icon': 'filter_list_outline',
        'onclickHandle': 'tuberCallbacks.appbarFilterBookmarks'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'submit search query'
    }
  },
  'layout': 'layout_none_no_appbar',
} as TStatePage

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
        link.add(homeLinkState)
      } else if (context.usr) {
        link.add(bookmarkAddFromUrlLinkState)
      }
      link.add(darkModeLinkState)
      link.add($66DarkThemeMode)
      appbar.items = link.items
      base.appbar = appbar
      return base
    })(),
    'light': (() => {
      const base = clone_with_descriptors(chippedListingPageState)
      const appbar = clone_with_descriptors(listingPageAppbarState)
      const link = clone_as_collection(appbar.items)
      if (Config.DEV) {
        link.add(researchAppErrorsViewLinkState)
        link.add(homeLinkState)
      } else if (context.usr) {
        link.add(bookmarkAddFromUrlLinkState)
      }
      link.add(lightModeLinkState)
      link.add(powerLogoutLinkState)
      appbar.items = link.items
      base.appbar = appbar
      return base
    })()
  }
}
