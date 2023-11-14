import Config from '../../config'
import { backgroundState } from '..'
import { $28_KEY, $30_KEY } from '../../constants'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '30', $30_KEY)
/** Dialog to create a new Unknown video bookmark @id 30 */
const newUnknownBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '30',
  '_key': $30_KEY,
  'title': 'Insert new Unknown Bookmark',
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
  'content': `$form : ${remove_form_suffix($28_KEY)} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$30_C_1'
      }
    }
  ],
  'open': true
}

export default newUnknownBookmarkDialogState