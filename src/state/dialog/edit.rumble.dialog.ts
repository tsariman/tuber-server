import Config from '../../config'
import { backgroundState } from '..'
import { $10_KEY, $11_KEY } from '../../constants'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '11', $11_KEY)
/** Dialog to edit a Rumble video bookmark @id 11 */
const editRumbleBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '11',
  '_key': $11_KEY,
  'title': 'Edit Rumble Bookmark',
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
  'content': `$form : ${remove_form_suffix($10_KEY)} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$11_C_1'
      }
    }
  ],
  'open': true
}

export default editRumbleBookmarkDialogState