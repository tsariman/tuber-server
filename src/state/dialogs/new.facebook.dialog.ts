import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { NEW_FACEBOOK_BOOKMARK_UNSUFFIXED_NAME } from '../forms/new.facebook.bookmark.form.state'

const _26 = '26'
const _26_KEY = 'newFacebookBookmarkDialog'
Config.register('state', _26, _26_KEY)
/** Dialog to create a new Facebook video bookmark @id 26 */
const newFacebookBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _26,
  '_key': _26_KEY,
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
        'onclickHandle': 'tuberCallbacks._26_C_1'
      }
    }
  ],
  'open': true
}

export default newFacebookBookmarkDialogState