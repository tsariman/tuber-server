import Config from '../../config';
import {
  $29_STATE_KEY,
  $31_STATE_KEY,
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR
} from '../../constants';
import { r, remove_form_suffix } from '../../business.logic';
import { TStateDialog } from '../../common.types';

Config.register('state', '31', $31_STATE_KEY);
/** Dialog to edit an unknown video platform bookmark @id 31 */
const editUnknownBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '31',
  '_key': $31_STATE_KEY,
  'title': r('24', 'Edit Unknown Bookmark'),
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
  'content': `$form : ${remove_form_suffix($29_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': r('25', 'Cancel'),
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        'text': r('26', 'Save'),
        'onclickHandle': 'tuberCallbacks.$31_C_1'
      }
    }
  ],
  'open': true
};

export default editUnknownBookmarkDialogState;

/**
 * Dark theme mode for form state to edit an existing unknown video
 * bookmark.
 * @id 31
 */
export const $31DarkThemeMode: TStateDialog = {
  ...editUnknownBookmarkDialogState,
  'props': {
    ...editUnknownBookmarkDialogState.props,
    'PaperProps': {
      ...editUnknownBookmarkDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  },
};