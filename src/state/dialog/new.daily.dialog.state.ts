import {
  $19_STATE_KEY,
  $21_STATE_KEY,
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  THEME_LIGHT_PAPER_SX_PROPS
} from '@tuber/shared';
import {
  t,
  remove_form_suffix,
  clone_with_descriptors,
  clone_or_default
} from '../../business.logic';
import { TStateDialog } from '../../shared';
import { register } from 'src/business.logic/registry';

register('state', '21', $21_STATE_KEY);
/** Dialog to create a new Dailymotion video bookmark @id 21 */
const newDailyBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '21',
  '_key': $21_STATE_KEY,
  get 'title'() { return t('52', 'Insert New Dailymotion Bookmark'); },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': { 'sx': { ...THEME_LIGHT_PAPER_SX_PROPS } }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($19_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('53', 'Cancel'); },
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('54', 'Save'); },
        'onclickHandle': 'tuberCallbacks.$21_C_1'
      }
    }
  ],
  'open': true
};

export default newDailyBookmarkDialogState;

/**
 * Dark theme mode for form state to create a new dailymotion video bookmark.
 * @id 21
 */
export const $21DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(newDailyBookmarkDialogState);
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