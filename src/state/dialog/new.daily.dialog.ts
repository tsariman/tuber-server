import Config from '../../config';
import {
  $19_STATE_KEY,
  $21_STATE_KEY,
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR
} from '../../constants';
import { r, remove_form_suffix } from '../../business.logic';
import { TStateDialog } from '../../common.types';

Config.register('state', '21', $21_STATE_KEY);
/** Dialog to create a new Dailymotion video bookmark @id 21 */
const newDailyBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '21',
  '_key': $21_STATE_KEY,
  'title': r('52', 'Insert New Dailymotion Bookmark'),
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
  'content': `$form : ${remove_form_suffix($19_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': r('53', 'Cancel'),
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': r('54', 'Save'),
        'onclickHandle': 'tuberCallbacks.$21_C_1'
      }
    }
  ],
  'open': true
};

export default newDailyBookmarkDialogState;

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
