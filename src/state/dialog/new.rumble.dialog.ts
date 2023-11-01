import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { NEW_RUMBLE_BOOKMARK_UNSUFFIXED_NAME } from '../form/new.rumble.bookmark.form.state'
import { $8_KEY } from '../../constants'

const $8 = '8'
Config.register('state', $8, $8_KEY)
/** Dialog to create a new Rumble video bookmark @id 8 */
const newRumbleBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': $8,
  '_key': $8_KEY,
  'title': 'Insert new Rumble Bookmark',
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
  'content': `$form : ${NEW_RUMBLE_BOOKMARK_UNSUFFIXED_NAME} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$8_C_1'
      }
    }
  ],
  'open': true
}

export default newRumbleBookmarkDialogState