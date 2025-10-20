import {
  $18_STATE_KEY,
  $23_STATE_KEY,
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  THEME_LIGHT_PAPER_SX_PROPS
} from '../../constants.server';
import {
  t,
  remove_form_suffix,
  clone_with_descriptors
} from '../../business.logic';
import { TStateDialog } from '../../shared';
import { register } from '../../business.logic/registry';

register('state', '23', $23_STATE_KEY);
/** Dialog to create a edit Odysee video bookmark @id 23 */
const editOdyseeBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '23',
  '_key': $23_STATE_KEY,
  get 'title'() { return t('15', 'Edit Odysee Bookmark'); },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': { 'sx': { ...THEME_LIGHT_PAPER_SX_PROPS } }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($18_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('16', 'Cancel'); },
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        get 'text'() { return t('17', 'Save'); },
        'onclickHandle': 'tuberCallbacks.$23_C_1'
      }
    }
  ],
  'open': true
};

export default editOdyseeBookmarkDialogState;

/**
 * Dark theme mode for form state to edit an existing odysee video bookmark.
 * @id 23
 */
export const $23DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(editOdyseeBookmarkDialogState);
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