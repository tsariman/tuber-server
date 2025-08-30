import { TStatePage } from '../../shared';
import { register } from '../../business.logic/registry';
import { $53_STATE_KEY } from '../../constants.server';
import { clone_with_descriptors } from 'src/business.logic';

register('state', '53', $53_STATE_KEY);
/** @id 53 */
const adminReadablePageState: TStatePage = {
  '_id': '53',
  '_key': $53_STATE_KEY,
  'content': '$webapp : adminReadable',
  'layout': 'layout_md',
  'appbar': {
    'appbarStyle': 'middle_search',
    'items': [
      {
        'has': {
          'text': 'Home',
          'route': '/'
        }
      }
    ],
    'inputBaseProps': {
      'id': 'filter-readable',
      'placeholder': 'Filter readable text ...',
      'inputProps': { 'aria-label': 'Readable text' },
    },

    'searchFieldIcon': {
      'icon': 'filter_none_outline',
      'svgIconProps': {
        'sx': { 'color': 'grey.500' }
      }
    },
    'searchFieldIconButton': {
      'has': {
        'icon': 'search_outline',
        'onclickHandle': 'tuberCallbacks.$53_C_1'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'filter readable text'
    }
  },
  'hideDrawer': true
};

export default adminReadablePageState;

export const $53DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(adminReadablePageState);
  return base;
})();