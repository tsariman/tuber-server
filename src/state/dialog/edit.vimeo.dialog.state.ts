import {
  $13_STATE_KEY,
  $15_STATE_KEY,
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  THEME_LIGHT_PAPER_SX_PROPS
} from '@tuber/shared';
import {
  t,
  remove_form_suffix,
  clone_or_default
} from '../../business.logic';
import { TStateDialog } from '@tuber/shared';
import { register } from '../../business.logic/registry';

register('state', '15', $15_STATE_KEY);
/** Dialog to edit an existing Vimeo video bookmark @id 15 */
const editVimeoBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '15',
  '_key': $15_STATE_KEY,
  get 'title'() { return t('27', 'Edit Vimeo Bookmark'); },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': { 'sx': { ...THEME_LIGHT_PAPER_SX_PROPS } }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `'$form : ${remove_form_suffix($13_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('28', 'Cancel'); },
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('29', 'Save'); },
        'onclickHandle': 'tuberCallbacks.$15_C_1'
      }
    }
  ],
  'open': true
};

export default editVimeoBookmarkDialogState;

/**
 * Dark theme mode for form state to edit an existing Vimeo video
 * bookmark.
 * @id 15
 */
export const $15DarkThemeMode: TStateDialog = (() => {
  const base = clone_or_default(editVimeoBookmarkDialogState, {});
  const props = clone_or_default(base.props, {});
  const paperProps = clone_or_default(props.PaperProps, {});
  const sx: typeof paperProps['sx'] = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  };
  paperProps.sx = sx;
  props.PaperProps = paperProps;
  base.props = props;
  return base;
})();
