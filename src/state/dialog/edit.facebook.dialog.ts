import Config from '../../config'
import {
  $25_KEY,
  $27_KEY,
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  THEME_LIGHT_BACKGROUND_COLOR
} from '../../constants'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '27', $27_KEY)
/** Dialog to edit a Facebook video bookmark @id 27 */
const editFacebookBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '27',
  '_key': $27_KEY,
  'title': 'Edit Facebook Bookmark',
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': { 'backgroundColor': THEME_LIGHT_BACKGROUND_COLOR }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($25_KEY)} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$27_C_1'
      }
    }
  ],
  'open': true
}

export default editFacebookBookmarkDialogState

/**
 * Dark theme mode for form state to edit an existing Facebook video
 * bookmark.
 * @id 27
 */
export const $27DarkThemeMode: TStateDialog = {
  ...editFacebookBookmarkDialogState,
  'props': {
    ...editFacebookBookmarkDialogState.props,
    'PaperProps': {
      ...editFacebookBookmarkDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  }
}