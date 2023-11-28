import Config from '../../config'
import {
  $10_STATE_KEY,
  $11_STATE_KEY,
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR
} from '../../constants'
import { remove_form_suffix } from '../../business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '11', $11_STATE_KEY)
/** Dialog to edit a Rumble video bookmark @id 11 */
const editRumbleBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '11',
  '_key': $11_STATE_KEY,
  'title': 'Edit Rumble Bookmark',
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
  'content': `$form : ${remove_form_suffix($10_STATE_KEY)} : bookmarks`,
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

/**
 * Dark theme mode for form state to edit an existing Rumble video
 * bookmark.
 * @id 11
 */
export const $11DarkThemeMode: TStateDialog = {
  ...editRumbleBookmarkDialogState,
  'props': {
    ...editRumbleBookmarkDialogState.props,
    'PaperProps': {
      ...editRumbleBookmarkDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  }
}