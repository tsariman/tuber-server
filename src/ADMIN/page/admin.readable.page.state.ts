import { register } from '../../business.logic/registry'
import { TStatePage } from '@tuber/shared'
import { clone_with_descriptors } from '../../business.logic'
import { homeLinkState } from '../../state/nav.link'
import STATE_KEY from '../../business.logic/state.key'

const $53 = STATE_KEY['53']

register('state', '53', $53)
/** @id 53 */
const adminReadablePageState: TStatePage = {
  '_id': '53',
  '_key': $53,
  'content': '$webapp : adminReadable',
  'layout': 'layout_md',
  'appbar': {
    'appbarStyle': 'middle_search',
    'items': [ homeLinkState ],
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
        'onclickHandler': 'tuberCallbacks.$53_C_1'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'filter readable text'
    }
  },
  'hideDrawer': true
}

export default adminReadablePageState

export const $53DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(adminReadablePageState)
  return base
})()