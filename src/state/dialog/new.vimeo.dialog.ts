import {
  $12_STATE_KEY,
  $14_STATE_KEY,
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR
} from '../../constants';
import { r, remove_form_suffix } from '../../business.logic';
import { TStateDialog } from '../../common.types';
import { register } from 'src/business.logic/registry';

register('state', '14', $14_STATE_KEY);
/** Dialog to create a new Vimeo video bookmark @id 14 */
const newVimeoBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '14',
  '_key': $14_STATE_KEY,
  'title': r('70', 'Insert New Vimeo Bookmark'),
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
  'content': `$form : ${remove_form_suffix($12_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': r('71', 'Cancel'),
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': r('72', 'Save'),
        'onclickHandle': 'tuberCallbacks.$14_C_1'
      }
    }
  ],
  'open': true
};

export default newVimeoBookmarkDialogState;

/**
 * Dark theme mode for form state to create a new Vimeo video bookmark.
 * @id 14
 */
export const $14DarkThemeMode: TStateDialog = {
  ...newVimeoBookmarkDialogState,
  'props': {
    ...newVimeoBookmarkDialogState.props,
    'PaperProps': {
      ...newVimeoBookmarkDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  }
};
