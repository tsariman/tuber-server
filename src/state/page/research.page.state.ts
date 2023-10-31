import Config from '../../config'
import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'

const $40 = '40'
export const $40_KEY = 'research-app'
Config.register('state', $40, $40_KEY)
/** @id 40 */
const researchPageState: IStatePage = {
  '_id': $40,
  '_key': $40_KEY,
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