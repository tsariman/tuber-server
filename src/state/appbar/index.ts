import {
  $63_STATE_KEY,
  $71_STATE_KEY,
  THEME_LIGHT_APP_BAR_ICON_COLOR as ICON_COLOR,
} from '../../constants';
import { TStateAppbar } from '../../common.types';
import { register } from '../../business.logic/registry';
import { powerSignInLinkState } from '../nav.link';
import { r } from 'src/business.logic';

register('state', '63', $63_STATE_KEY);
/** State for research page app bar. @id 63 */
const researchPageAppbarState: TStateAppbar = {
  '_id': '63',
  '_key': $63_STATE_KEY,
  'appbarStyle': 'middle_search',
  'items': [ powerSignInLinkState ],
  'searchFieldProps': {
    'sx': { 'backgroundColor': 'transparent' }
  },
  'inputBaseProps': {
    'id': r('1', 'search-query'),
    'placeholder': r('2', 'Search ...'),
    'inputProps': { 'aria-label': r('3', 'Search Bookmarks') },
  },
  'searchFieldIcon': {
    'icon': 'public_outline',
    'iconProps': {
      'sx': { 'color': ICON_COLOR }
    }
  },
  'searchFieldIconButton': {
    'has': {
      'icon': 'search_outline',
      'onclickHandle': 'tuberCallbacks.$63_C_1', // appbarSearchBookmarks'
    }
  },
  'searchFieldIconButtonProps': {
    'aria-label': r('4', 'submit search query')
  }
};

export default researchPageAppbarState;

/** Dark theme mode for research page app bar state. @id 63 */
export const $63DarkThemeMode: TStateAppbar = {
  ...researchPageAppbarState,
};

/** State for listing page app bar. @id 71 */
export const listingPageAppbarState: TStateAppbar = {
  ...researchPageAppbarState,
  '_id': '71',
  '_key': $71_STATE_KEY,
  'inputBaseProps': {
    'id': r('5', 'filter-query'),
    'placeholder': r('6', 'Filter ...'),
    'inputProps': { 'aria-label': r('7', 'Filter loaded Bookmarks') },
  },
  'searchFieldIconButton': {
    'has': {
      'icon': 'filter_list_outline',
      'onclickHandle': 'tuberCallbacks.$71_C_1', // appbarFilterBookmarks'
    }
  },
};

/** Dark theme mode for listing page app bar state. @id 71 */
export const $71DarkThemeMode: TStateAppbar = {
  ...listingPageAppbarState,
};