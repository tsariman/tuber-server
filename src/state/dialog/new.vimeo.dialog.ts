import Config from '../../config'
import { backgroundState } from '..'
import { $12_KEY, $14_KEY } from '../../constants'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '14', $14_KEY)
/** Dialog to create a new Vimeo video bookmark @id 14 */
const newVimeoBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '14',
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
  'content': `$form : ${remove_form_suffix($12_KEY)} : bookmarks`,
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