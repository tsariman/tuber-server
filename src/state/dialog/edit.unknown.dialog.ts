import {
  $29_STATE_KEY,
  $31_STATE_KEY,
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR
} from '../../constants.server';
import { t, remove_form_suffix, clone_with_descriptors } from '../../business.logic';
import { TStateDialog } from '../../shared';
import { register } from '../../business.logic/registry';

register('state', '31', $31_STATE_KEY);
/** Dialog to edit an unknown video platform bookmark @id 31 */
const editUnknownBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '31',
  '_key': $31_STATE_KEY,
  get 'title'() { return t('24', 'Edit Unknown Bookmark'); },
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
        get 'text'() { return t('25', 'Cancel'); },
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        get 'text'() { return t('26', 'Save'); },
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
export const $31DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(editUnknownBookmarkDialogState);
  const props = clone_with_descriptors(base.props ?? {});
  const paperProps = clone_with_descriptors(props.PaperProps ?? {});
  const sx: typeof paperProps['sx'] = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  };
  paperProps.sx = sx;
  props.PaperProps = paperProps;
  base.props = props;
  return base;
})();
