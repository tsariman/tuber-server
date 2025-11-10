import {
  $37_STATE_KEY,
  $39_STATE_KEY,
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  THEME_LIGHT_PAPER_SX_PROPS,
  TStateDialog
} from '@tuber/shared';
import {
  t,
  remove_form_suffix,
  clone_with_descriptors
} from '../../business.logic';
import { register } from '../../business.logic/registry';

register('state', '37', $37_STATE_KEY);
/** Dialog to edit an existing Twitch video bookmark @id 37 */
const editTwitchBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '37',
  '_key': $37_STATE_KEY,
  get 'title'() { return t('21', 'Edit Twitch Bookmark'); },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': { 'sx': { ...THEME_LIGHT_PAPER_SX_PROPS } }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($39_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('22', 'Cancel'); },
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('23', 'Save'); },
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
export const $37DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(editTwitchBookmarkDialogState);
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
