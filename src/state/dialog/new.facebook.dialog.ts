import {
  $24_STATE_KEY,
  $26_STATE_KEY,
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR
} from '../../constants.server';
import { r, remove_form_suffix } from '../../business.logic';
import { register } from '../../business.logic/registry';
import { TStateDialog } from '../../shared';

register('state', '26', $26_STATE_KEY);
/** Dialog to create a new Facebook video bookmark @id 26 */
const newFacebookBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '26',
  '_key': $26_STATE_KEY,
  'title': r('55', 'Insert new Facebook Bookmark'),
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
  'content': `$form : ${remove_form_suffix($24_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': r('56', 'Cancel'),
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        'text': r('57', 'Save'),
        'onclickHandle': 'tuberCallbacks.$26_C_1'
      }
    }
  ],
  'open': true
};

export default newFacebookBookmarkDialogState;

/**
 * Dark theme mode for form state to create a new Facebook video bookmark.
 * @id 26
 */
export const $26DarkThemeMode: TStateDialog = {
  ...newFacebookBookmarkDialogState,
  'props': {
    ...newFacebookBookmarkDialogState.props,
    'PaperProps': {
      ...newFacebookBookmarkDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  },
};