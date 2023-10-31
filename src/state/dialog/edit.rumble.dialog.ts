import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { EDIT_RUMBLE_BOOKMARK_UNSUFFIXED_NAME } from '../form/edit.rumble.bookmark.form.state'

const $11 = '11'
const $11_KEY = 'editRumbleBookmarkDialog'
Config.register('state', $11, $11_KEY)
/** Dialog to edit a Rumble video bookmark @id 11 */
const editRumbleBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': $11,
  '_key': $11_KEY,
  'title': 'Edit Rumble Bookmark',
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
  'content': `$form : ${EDIT_RUMBLE_BOOKMARK_UNSUFFIXED_NAME} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$11_C_1'
      }
    }
  ],
  'open': true
}

export default editRumbleBookmarkDialogState