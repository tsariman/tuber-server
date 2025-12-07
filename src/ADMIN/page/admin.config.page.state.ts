import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import { TStatePage, $55_STATE_KEY } from '@tuber/shared'

register('state', '55', $55_STATE_KEY)
/** @id 55 */
const adminConfigPageState: TStatePage = {
  '_id': '55',
  '_key': $55_STATE_KEY,
  'content': '$webapp : config',
  'appbar': {
    'appbarStyle': 'middle_search',
    'items': [ ],
    'inputBaseProps': {
      'id': 'video-url',
      get 'placeholder'() { return t('273', 'Filter ...') },
      'inputProps': { 'aria-label': 'Configuration filter' },
    },
    'searchFieldIcon': {
      'icon': 'alternate_email_outline',
      'svgIconProps': {
        'sx': { 'color': 'grey.500' }
      }
    },
    'searchFieldIconButton': {
      'has': {
        'icon': 'search_outline',
        'onclickHandler': 'tuberCallbacks.$55_C_1'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'Filter configurations'
    }
  },
  'layout': 'layout_md',
  'meta': {
    'endpoint': 'bookmarks'
  }
}

export default adminConfigPageState

export const $55DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(adminConfigPageState)
  return base
})()
