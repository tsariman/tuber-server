import {
  $20_STATE_KEY,
  $22_STATE_KEY,
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

register('state', '22', $22_STATE_KEY);
/** Dialog to edit an existing Dailymotion video bookmark @id 22 */
const editDailyBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '22',
  '_key': $22_STATE_KEY,
  get 'title'() { return t('9', 'Edit Dailymotion Bookmark'); },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': { 'sx': { ...THEME_LIGHT_PAPER_SX_PROPS } }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($20_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('10', 'Cancel'); },
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('11', 'Save'); },
        'onclickHandle': 'tuberCallbacks.$22_C_1'
      }
    }
  ],
  'open': true
};

export default editDailyBookmarkDialogState;

/**
 * Dark theme mode for form state to edit an existing dailymotion video
 * bookmark.
 * @id 22
 */
export const $22DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(editDailyBookmarkDialogState);
  const props = clone_with_descriptors(editDailyBookmarkDialogState.props ?? {});
  const paperProps = clone_with_descriptors(props.PaperProps ?? {});
  const sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  } as typeof paperProps['sx'];
  paperProps.sx = sx;
  props.PaperProps = paperProps;
  base.props = props;
  return base;
})();
