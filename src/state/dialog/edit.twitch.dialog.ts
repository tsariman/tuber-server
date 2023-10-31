import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import Config from '../../config'
import { EDIT_TWITCH_BOOKMARK_UNSUFFIXED_NAME } from '../form/edit.twitch.bookmark.form.state'

const $37 = '37'
const $37_KEY = 'editTwitchBookmarkDialog'
Config.register('state', $37, $37_KEY)
/** Dialog to edit an existing Twitch video bookmark @id 37 */
const editTwitchBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': $37,
  '_key': $37_KEY,
  'title': 'Edit Twitch Bookmark',
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
  'content': `'$form : ${EDIT_TWITCH_BOOKMARK_UNSUFFIXED_NAME} : bookmarks'`,
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
        'text': 'Save',
        'onclickHandle': 'tuberCallbacks.$37_C_1'
      }
    }
  ],
  'open': true
}

export default editTwitchBookmarkDialogState