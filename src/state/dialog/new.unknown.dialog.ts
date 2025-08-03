import {
  $28_STATE_KEY,
  $30_STATE_KEY,
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR
} from '../../constants.server';
import { r, remove_form_suffix } from '../../business.logic';
import { register } from '../../business.logic/registry';
import { TStateDialog } from '../../shared';

register('state', '30', $30_STATE_KEY);
/** Dialog to create a new Unknown video bookmark @id 30 */
const newUnknownBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '30',
  '_key': $30_STATE_KEY,
  'title': r('67', 'Insert new Unknown Bookmark'),
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
  'content': `$form : ${remove_form_suffix($28_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': r('68', 'Cancel'),
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        'text': r('69', 'Save'),
        'onclickHandle': 'tuberCallbacks.$30_C_1'
      }
    }
  ],
  'open': true
};

export default newUnknownBookmarkDialogState;

/**
 * Dark theme mode for form state to create a new Unknown video bookmark.
 * @id 30
 */
export const $30DarkThemeMode: TStateDialog = {
  ...newUnknownBookmarkDialogState,
  'props': {
    ...newUnknownBookmarkDialogState.props,
    'PaperProps': {
      ...newUnknownBookmarkDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  }
};
