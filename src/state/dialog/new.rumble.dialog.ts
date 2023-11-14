import Config from '../../config'
import { backgroundState } from '..'
import { $8_KEY, $9_KEY } from '../../constants'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '8', $8_KEY)
/** Dialog to create a new Rumble video bookmark @id 8 */
const newRumbleBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '8',
  '_key': $8_KEY,
  'title': 'Insert new Rumble Bookmark',
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
  'content': `$form : ${remove_form_suffix($9_KEY)} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$8_C_1'
      }
    }
  ],
  'open': true
}

export default newRumbleBookmarkDialogState