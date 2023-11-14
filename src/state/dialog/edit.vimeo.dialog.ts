import { $13_KEY, $15_KEY } from '../../constants'
import { backgroundState } from '..'
import Config from '../../config'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '15', $15_KEY)
/** Dialog to edit an existing Vimeo video bookmark @id 15 */
const editVimeoBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '15',
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
  'content': `'$form : ${remove_form_suffix($13_KEY)} : bookmarks'`,
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