import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { NEW_ODYSEE_BOOKMARK_UNSUFFIXED_NAME } from '../form/new.odysee.bookmark.form.state'

const _16 = '16'
const _16_KEY = 'newOdyseeBookmarkDialog'
Config.register('state', _16, _16_KEY)
/** Dialog to create a new Odysee video bookmark @id 16 */
const newOdyseeBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _16,
  '_key': _16_KEY,
  'title': 'Insert new Odysee Bookmark',
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
  'content': `$form : ${NEW_ODYSEE_BOOKMARK_UNSUFFIXED_NAME} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks._16_C_1'
      }
    }
  ],
  'open': true
}

export default newOdyseeBookmarkDialogState