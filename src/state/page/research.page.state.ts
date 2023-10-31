import Config from '../../config'
import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'

const _40 = '40'
const _40_KEY = 'research-app'
Config.register('state', _40, _40_KEY)
/** @id 40 */
const researchPageState: IStatePage = {
  '_id': _40,
  '_key': _40_KEY,
  'content': '$webapp : tubeResearcher',
  'appBar': {
    'appBarStyle': 'middle_search',
    'items': [ ],
    'inputBaseProps': {
      'id': 'video-url',
      'placeholder': 'Paste Video URL Here ...',
      'inputProps': { 'aria-label': 'Video URL' },
    },
    'searchFieldIcon': {
      'icon': 'alternate_email_outline',
      'iconProps': {
        'sx': { 'color': 'grey.500' }
      }
    },
    'searchFieldIconButton': {
      'has': {
        'icon': 'search_outline',
        'onclickHandle': 'tuberCallbacks.appBarSearchForBookmarks'
      }
    },
    'searchFieldIconButtonProps': {
      'aria-label': 'load video url'
    }
  },
  'layout': 'layout_none_no_appbar',
  'meta': {
    'endpoint': 'bookmarks'
  }
}

export default researchPageState