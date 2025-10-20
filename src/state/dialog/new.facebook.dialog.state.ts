import {
  $24_STATE_KEY,
  $26_STATE_KEY,
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  THEME_LIGHT_PAPER_SX_PROPS
} from '../../constants.server';
import {
  t,
  remove_form_suffix,
  clone_with_descriptors,
  clone_or_default
} from '../../business.logic';
import { register } from '../../business.logic/registry';
import { TStateDialog } from '../../shared';

register('state', '26', $26_STATE_KEY);
/** Dialog to create a new Facebook video bookmark @id 26 */
const newFacebookBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '26',
  '_key': $26_STATE_KEY,
  get 'title'() { return t('55', 'Insert new Facebook Bookmark'); },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': { 'sx': { ...THEME_LIGHT_PAPER_SX_PROPS } }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($24_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('56', 'Cancel'); },
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        get 'text'() { return t('57', 'Save'); },
        'onclickHandle': 'tuberCallbacks.$26_C_1'
      }
    }
  ],
  'open': true
};

export default newFacebookBookmarkDialogState;

/**
 * Dark theme mode for form state to create a new Facebook video bookmark.
 * @id 26
 */
export const $26DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(newFacebookBookmarkDialogState);
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
