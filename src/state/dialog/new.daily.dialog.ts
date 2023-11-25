import Config from '../../config'
import {
  $19_KEY,
  $21_KEY,
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR
} from '../../constants'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TStateDialog } from '../../common.types'

Config.register('state', '21', $21_KEY)
/** Dialog to create a new Dailymotion video bookmark @id 21 */
const newDailyBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '21',
  '_key': $21_KEY,
  'title': 'Insert New Dailymotion Bookmark',
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
  'content': `$form : ${remove_form_suffix($19_KEY)} : bookmarks`,
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
        'onclickHandle': 'tuberCallbacks.$21_C_1'
      }
    }
  ],
  'open': true
}

export default newDailyBookmarkDialogState

/**
 * Dark theme mode for form state to create a new dailymotion video bookmark.
 * @id 21
 */
export const $21DarkThemeMode: TStateDialog = {
  ...newDailyBookmarkDialogState,
  'props': {
    ...newDailyBookmarkDialogState.props,
    'PaperProps': {
      ...newDailyBookmarkDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  }
}
