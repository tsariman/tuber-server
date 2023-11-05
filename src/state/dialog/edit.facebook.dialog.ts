import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { EDIT_FACEBOOK_BOOKMARK_UNSUFFIXED_NAME } from '../form/edit.facebook.bookmark.form.state'
import { $27_KEY } from '../../constants'

Config.register('state', '27', $27_KEY)
/** Dialog to edit a Facebook video bookmark @id 27 */
const editFacebookBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': '27',
  '_key': $27_KEY,
  'title': 'Edit Facebook Bookmark',
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
  'content': `$form : ${EDIT_FACEBOOK_BOOKMARK_UNSUFFIXED_NAME} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$27_C_1'
      }
    }
  ],
  'open': true
}

export default editFacebookBookmarkDialogState