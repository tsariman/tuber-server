import Config from '../../config'
import {
  $18_KEY,
  $23_KEY,
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR
} from '../../constants'
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
      'sx': { 'backgroundColor': THEME_LIGHT_BACKGROUND_COLOR }
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

/**
 * Dark theme mode for form state to edit an existing odysee video bookmark.
 * @id 23
 */
export const $23DarkThemeMode: TStateDialog = {
  ...editOdyseeBookmarkDialogState,
  'props': {
    ...editOdyseeBookmarkDialogState.props,
    'PaperProps': {
      ...editOdyseeBookmarkDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  }
}