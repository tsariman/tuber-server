import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { EDIT_UNKNOWN_BOOKMARK_UNSUFFIXED_NAME } from '../form/edit.unknown.bookmark.form.state'

const $31 = '31'
const $31_KEY = 'editUnknownBookmarkDialog'
Config.register('state', $31, $31_KEY)
/** Dialog to edit an unknown video platform bookmark @id 31 */
const editUnknownBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': $31,
  '_key': $31_KEY,
  'title': 'Edit Unknown Bookmark',
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
  'content': `$form : ${EDIT_UNKNOWN_BOOKMARK_UNSUFFIXED_NAME} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$31_C_1'
      }
    }
  ],
  'open': true
}

export default editUnknownBookmarkDialogState