import {
  $63_STATE_KEY,
  $71_STATE_KEY,
  THEME_LIGHT_APP_BAR_ICON_COLOR as ICON_COLOR,
} from '../../constants.server';
import { TStateAppbar } from '../../shared';
import { register } from '../../business.logic/registry';
import { powerSignInLinkState } from '../nav.link';
import { clone_with_descriptors, t } from '../../business.logic';

register('state', '63', $63_STATE_KEY);
/** State for research page app bar. @id 63 */
const researchPageAppbarState: TStateAppbar = {
  '_id': '63',
  '_key': $63_STATE_KEY,
  'appbarStyle': 'middle_search',
  'items': [ powerSignInLinkState ],
  'searchContainerProps': {
    'sx': { 'backgroundColor': 'transparent' }
  },
  'inputBaseProps': {
    get 'id'() { return t('1', 'search-query'); },
    get 'placeholder'(){ return t('2', 'Search ...'); },
    'inputProps': { get 'aria-label'() { return t('3', 'Search Bookmarks'); }},
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
      'onclickHandle': 'tuberCallbacks.$63_C_1',
    }
  },
  'searchFieldIconButtonProps': {
    get 'aria-label'() { return t('4', 'submit search query'); }
  }
};

export default researchPageAppbarState;

/** Dark theme mode for research page app bar state. @id 63 */
export const $63DarkThemeMode: TStateAppbar = (() => {
  const base = clone_with_descriptors(researchPageAppbarState);
  return base;
})();

/** State for listing page app bar. @id 71 */
export const listingPageAppbarState: TStateAppbar = {
  ...researchPageAppbarState,
  '_id': '71',
  '_key': $71_STATE_KEY,
  'inputBaseProps': {
    get 'id'() { return t('5', 'filter-query'); },
    get 'placeholder'() { return t('6', 'Filter ...'); },
    'inputProps': { get 'aria-label'() { return t('7', 'Filter loaded Bookmarks'); } },
  },
  'searchFieldIconButton': {
    'has': {
      'icon': 'filter_list_outline',
      'onclickHandle': 'tuberCallbacks.$71_C_1',
    }
  },
};

/** Dark theme mode for listing page app bar state. @id 71 */
export const $71DarkThemeMode: TStateAppbar = (() => {
  const base = clone_with_descriptors(listingPageAppbarState);
  return base;
})();
