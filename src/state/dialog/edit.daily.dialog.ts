import Config from '../../config'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { backgroundState } from '..'
import { EDIT_DAILY_BOOKMARK_UNSUFFIXED_NAME } from '../form/edit.daily.bookmark.form.state'

const _22 = '22'
const _22_KEY = 'editDailyBookmarkDialog'
Config.register('state', _22, _22_KEY)
/** Dialog to edit an existing Dailymotion video bookmark @id 22 */
const editDailyBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _22,
  '_key': _22_KEY,
  'title': 'Edit Dailymotion Bookmark',
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
  'content': `'$form : ${EDIT_DAILY_BOOKMARK_UNSUFFIXED_NAME} : bookmarks'`,
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
        'onclickHandle': 'tuberCallbacks._22_C_1'
      }
    }
  ],
  'open': true
}

export default editDailyBookmarkDialogState