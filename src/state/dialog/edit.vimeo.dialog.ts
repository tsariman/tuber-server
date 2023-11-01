import { $15_KEY } from '../../constants'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import Config from '../../config'
import { EDIT_VIMEO_BOOKMARK_UNSUFFIXED_NAME } from '../form/edit.vimeo.bookmark.form.state'

const $15 = '15'
Config.register('state', $15, $15_KEY)
/** Dialog to edit an existing Vimeo video bookmark @id 15 */
const editVimeoBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': $15,
  '_key': $15_KEY,
  'title': 'Edit Vimeo Bookmark',
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
  'content': `'$form : ${EDIT_VIMEO_BOOKMARK_UNSUFFIXED_NAME} : bookmarks'`,
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
        'onclickHandle': 'tuberCallbacks.$15_C_1'
      }
    }
  ],
  'open': true
}

export default editVimeoBookmarkDialogState