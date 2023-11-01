import Config from '../../config'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { backgroundState } from '..'
import { NEW_VIMEO_ANNNOTATION_UNSUFFIXED_NAME } from '../form/new.vimeo.bookmark.form.state'
import { $14_KEY } from '../../constants'

const $14 = '14'
Config.register('state', $14, $14_KEY)
/** Dialog to create a new Vimeo video bookmark @id 14 */
const newVimeoBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': $14,
  '_key': $14_KEY,
  'title': 'Insert New Vimeo Bookmark',
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
  'content': `$form : ${NEW_VIMEO_ANNNOTATION_UNSUFFIXED_NAME} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$14_C_1'
      }
    }
  ],
  'open': true
}

export default newVimeoBookmarkDialogState