import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { NEW_FACEBOOK_BOOKMARK_UNSUFFIXED_NAME } from '../form/new.facebook.bookmark.form.state'
import { $26_KEY } from '../../constants'

const $26 = '26'
Config.register('state', $26, $26_KEY)
/** Dialog to create a new Facebook video bookmark @id 26 */
const newFacebookBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': $26,
  '_key': $26_KEY,
  'title': 'Insert new Facebook Bookmark',
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
  'content': `$form : ${NEW_FACEBOOK_BOOKMARK_UNSUFFIXED_NAME} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$26_C_1'
      }
    }
  ],
  'open': true
}

export default newFacebookBookmarkDialogState