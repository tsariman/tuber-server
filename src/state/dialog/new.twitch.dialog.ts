import Config from '../../config'
import {
  $36_KEY,
  $38_KEY,
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR
} from '../../constants'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '36', $36_KEY)
/** Dialog to create a new Twitch video bookmark @id 36 */
const newTwitchBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '36',
  '_key': $36_KEY,
  'title': 'Insert New Twitch Bookmark',
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
  'content': `$form : ${remove_form_suffix($38_KEY)} : bookmarks`,
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
        'text': 'Save',
        'onclickHandle': 'tuberCallbacks.$36_C_1'
      }
    }
  ],
  'open': true
}

export default newTwitchBookmarkDialogState

/**
 * Dark theme mode for form state to create a new Twitch video bookmark.
 * @id 36
 */
export const $36DarkThemeMode: TStateDialog = {
  ...newTwitchBookmarkDialogState,
  'props': {
    ...newTwitchBookmarkDialogState.props,
    'PaperProps': {
      ...newTwitchBookmarkDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  }
}
