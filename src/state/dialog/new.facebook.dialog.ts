import Config from '../../config'
import { backgroundState } from '..'
import { $24_KEY, $26_KEY } from '../../constants'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '26', $26_KEY)
/** Dialog to create a new Facebook video bookmark @id 26 */
const newFacebookBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '26',
  '_key': $26_KEY,
  'title': 'Insert new Facebook Bookmark',
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
  'content': `$form : ${remove_form_suffix($24_KEY)} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$26_C_1'
      }
    }
  ],
  'open': true
}

export default newFacebookBookmarkDialogState