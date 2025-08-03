import {
  $37_STATE_KEY,
  $39_STATE_KEY,
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR
} from '../../constants.server';
import { r, remove_form_suffix } from '../../business.logic';
import { TStateDialog } from '../../shared';
import { register } from '../../business.logic/registry';

register('state', '37', $37_STATE_KEY);
/** Dialog to edit an existing Twitch video bookmark @id 37 */
const editTwitchBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '37',
  '_key': $37_STATE_KEY,
  'title': r('21', 'Edit Twitch Bookmark'),
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
  'content': `'$form : ${remove_form_suffix($39_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': r('22', 'Cancel'),
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': r('23', 'Save'),
        'onclickHandle': 'tuberCallbacks.$37_C_1'
      }
    }
  ],
  'open': true
};

export default editTwitchBookmarkDialogState;

/**
 * Dark theme mode for form state to edit an existing Twitch video
 * bookmark.
 * @id 37
 */
export const $37DarkThemeMode: TStateDialog = {
  ...editTwitchBookmarkDialogState,
  'props': {
    ...editTwitchBookmarkDialogState.props,
    'PaperProps': {
      ...editTwitchBookmarkDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  }
};