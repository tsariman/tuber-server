import Config from '../../config'
import { backgroundState } from '..'
import { $16_KEY, $17_KEY } from '../../constants'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '16', $16_KEY)
/** Dialog to create a new Odysee video bookmark @id 16 */
const newOdyseeBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '16',
  '_key': $16_KEY,
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
  'content': `$form : ${remove_form_suffix($17_KEY)} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$16_C_1'
      }
    }
  ],
  'open': true
}

export default newOdyseeBookmarkDialogState