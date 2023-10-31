import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { NEW_UNKNOWN_BOOKMARK_UNSUFFIXED_NAME } from '../form/new.unknown.bookmark.form.state'

const _30 = '30'
const _30_KEY = 'newUnknownBookmarkDialog'
Config.register('state', _30, _30_KEY)
/** Dialog to create a new Unknown video bookmark @id 30 */
const newUnknownBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _30,
  '_key': _30_KEY,
  'title': 'Insert new Unknown Bookmark',
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': { 'backgroundColor': backgroundState.color }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${NEW_UNKNOWN_BOOKMARK_UNSUFFIXED_NAME} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': 'Cancel',
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        'text': 'Save',
        'onclickHandle': 'tuberCallbacks._30_C_1'
      }
    }
  ],
  'open': true
}

export default newUnknownBookmarkDialogState