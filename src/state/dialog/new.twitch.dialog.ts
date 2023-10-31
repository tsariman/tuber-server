import Config from '../../config'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { backgroundState } from '..'
import { NEW_TWITCH_ANNNOTATION_UNSUFFIXED_NAME } from '../form/new.twitch.bookmark.form.state'

const _36 = '36'
const _36_KEY = 'newTwitchBookmarkDialog'
Config.register('state', _36, _36_KEY)
/** Dialog to create a new Twitch video bookmark @id 36 */
const newTwitchBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _36,
  '_key': _36_KEY,
  'title': 'Insert New Twitch Bookmark',
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
  'content': `$form : ${NEW_TWITCH_ANNNOTATION_UNSUFFIXED_NAME} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks._36_C_1'
      }
    }
  ],
  'open': true
}

export default newTwitchBookmarkDialogState