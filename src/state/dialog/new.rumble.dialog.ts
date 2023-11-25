import Config from '../../config'
import {
  $8_KEY,
  $9_KEY,
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR
} from '../../constants'
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
      'sx': { 'backgroundColor': THEME_LIGHT_BACKGROUND_COLOR }
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

/**
 * Dark theme mode for form state to create a new Rumble video bookmark.
 * @id 8
 */
export const $8DarkThemeMode: TStateDialog = {
  ...newRumbleBookmarkDialogState,
  'props': {
    ...newRumbleBookmarkDialogState.props,
    'PaperProps': {
      ...newRumbleBookmarkDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  }
}
