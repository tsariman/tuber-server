import Config from '../../config'
import { backgroundState } from '..'
import { $18_KEY, $23_KEY } from '../../constants'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '23', $23_KEY)
/** Dialog to create a edit Odysee video bookmark @id 23 */
const editOdyseeBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '23',
  '_key': $23_KEY,
  'title': 'Edit Odysee Bookmark',
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
  'content': `$form : ${remove_form_suffix($18_KEY)} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$23_C_1'
      }
    }
  ],
  'open': true
}

export default editOdyseeBookmarkDialogState