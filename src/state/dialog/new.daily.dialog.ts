import Config from '../../config'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { backgroundState } from '..'
import { NEW_DAILY_ANNNOTATION_UNSUFFIXED_NAME } from '../form/new.daily.bookmark.form.state'
import { $21_KEY } from '../../constants'

Config.register('state', '21', $21_KEY)
/** Dialog to create a new Dailymotion video bookmark @id 21 */
const newDailyBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': '21',
  '_key': $21_KEY,
  'title': 'Insert New Dailymotion Bookmark',
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
  'content': `$form : ${NEW_DAILY_ANNNOTATION_UNSUFFIXED_NAME} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$21_C_1'
      }
    }
  ],
  'open': true
}

export default newDailyBookmarkDialogState