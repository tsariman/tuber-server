import {
  THEME_LIGHT_APP_BAR_ICON_COLOR as ICON_COLOR,
  TStateAppbar
} from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { powerSignInLinkState } from '../nav.link'
import { clone_with_descriptors, t } from '../../business.logic'
import STATE_KEY from '../../business.logic/state.key'

const $63 = STATE_KEY['63']
const $71 = STATE_KEY['71']
const $73 = STATE_KEY['73']

register('state', '73', $73)
/** A provided default app bar as starting point for any page */
export const defaultPageAppbarState: TStateAppbar = {
  '_id': '73',
  '_key': $73,
  'appbarStyle': 'mini',
  'items': [ powerSignInLinkState ],
}

/** Dark theme mode for the default page app bar state. @id 73 */
export const $73DarkThemeMode: TStateAppbar = (() => {
  const base = clone_with_descriptors(defaultPageAppbarState)
  return base
})()

register('state', '63', $63)
/** State for research page app bar. @id 63 */
const researchPageAppbarState: TStateAppbar = {
  '_id': '63',
  '_key': $63,
  'appbarStyle': 'middle_search',
  'items': [ ],
  'searchContainerProps': {
    'sx': { 'backgroundColor': 'transparent' }
  },
  'inputBaseProps': {
    get 'id'() { return t('1', 'search-query') },
    get 'placeholder'(){ return t('2', 'Search ...') },
    'inputProps': { get 'aria-label'() { return t('3', 'Search Bookmarks') }},
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
      'onclickHandler': 'tuberCallbacks.$63_C_1',
    }
  },
  'searchFieldIconButtonProps': {
    get 'aria-label'() { return t('4', 'submit search query') }
  },
  'startAdornmentButton': {
    'has': {
      'icon': 'public_outline',
      // The following is commented out because handler is dynamically set. Search CREF1
      // 'onclickHandler': 'tuberCallbacks.toggleSearchScope',
    }
  },
}

export default researchPageAppbarState

/** Dark theme mode for research page app bar state. @id 63 */
export const $63DarkThemeMode: TStateAppbar = (() => {
  const base = clone_with_descriptors(researchPageAppbarState)
  return base
})()

/** State for listing page app bar. @id 71 */
export const listingPageAppbarState: TStateAppbar = (() => {
  const base = clone_with_descriptors(researchPageAppbarState)
  base['_id'] = '71'
  base['_key'] = $71
  base['inputBaseProps'] = {
    get 'id'() { return t('5', 'filter-query') },
    get 'placeholder'() { return t('6', 'Filter ...') },
    'inputProps': { get 'aria-label'() { return t('7', 'Filter loaded Bookmarks') } },
  }
  base['searchFieldIconButton'] = {
    'has': {
      'icon': 'filter_list_outline',
      'onclickHandler': 'tuberCallbacks.$71_C_1',
    }
  }
  return base
})()

/** Dark theme mode for listing page app bar state. @id 71 */
export const $71DarkThemeMode: TStateAppbar = (() => {
  const base = clone_with_descriptors(listingPageAppbarState)
  return base
})()
