import { $37_KEY, $39_KEY } from '../../constants'
import { backgroundState } from '..'
import Config from '../../config'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '37', $37_KEY)
/** Dialog to edit an existing Twitch video bookmark @id 37 */
const editTwitchBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '37',
  '_key': $37_KEY,
  'title': 'Edit Twitch Bookmark',
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
  'content': `'$form : ${remove_form_suffix($39_KEY)} : bookmarks'`,
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
        'onclickHandle': 'tuberCallbacks.$37_C_1'
      }
    }
  ],
  'open': true
}

export default editTwitchBookmarkDialogState