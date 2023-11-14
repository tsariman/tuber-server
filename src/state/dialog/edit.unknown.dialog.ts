import Config from '../../config'
import { backgroundState } from '..'
import { $29_KEY, $31_KEY } from '../../constants'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '31', $31_KEY)
/** Dialog to edit an unknown video platform bookmark @id 31 */
const editUnknownBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '31',
  '_key': $31_KEY,
  'title': 'Edit Unknown Bookmark',
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
  'content': `$form : ${remove_form_suffix($29_KEY)} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$31_C_1'
      }
    }
  ],
  'open': true
}

export default editUnknownBookmarkDialogState