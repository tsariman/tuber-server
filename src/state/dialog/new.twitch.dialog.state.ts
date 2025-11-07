import {
  $36_STATE_KEY,
  $38_STATE_KEY,
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  THEME_LIGHT_PAPER_SX_PROPS
} from '@tuber/shared';
import {
  t,
  remove_form_suffix,
  clone_with_descriptors,
  clone_or_default
} from '../../business.logic';
import { register } from '../../business.logic/registry';
import { TStateDialog } from '@tuber/shared';

register('state', '36', $36_STATE_KEY);
/** Dialog to create a new Twitch video bookmark @id 36 */
const newTwitchBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '36',
  '_key': $36_STATE_KEY,
  get 'title'() { return t('64', 'Insert New Twitch Bookmark'); },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': { 'sx': { ...THEME_LIGHT_PAPER_SX_PROPS } }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($38_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('65', 'Cancel'); },
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('66', 'Save'); },
        'onclickHandle': 'tuberCallbacks.$36_C_1'
      }
    }
  ],
  'open': true
};

export default newTwitchBookmarkDialogState;

/**
 * Dark theme mode for form state to create a new Twitch video bookmark.
 * @id 36
 */
export const $36DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(newTwitchBookmarkDialogState);
  const props = clone_or_default(base.props, {});
  const paperProps = clone_or_default(props.PaperProps, {});
  paperProps.sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  };
  props.PaperProps = paperProps;
  base.props = props;
  return base;
})();
