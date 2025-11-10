import {
  $16_STATE_KEY,
  $17_STATE_KEY,
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  THEME_LIGHT_PAPER_SX_PROPS,
  TStateDialog
} from '@tuber/shared';
import {
  t,
  remove_form_suffix,
  clone_with_descriptors,
  clone_or_default
} from '../../business.logic';
import { register } from '../../business.logic/registry';

register('state', '16', $16_STATE_KEY);
/** Dialog to create a new Odysee video bookmark @id 16 */
const newOdyseeBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '16',
  '_key': $16_STATE_KEY,
  get 'title'() { return t('58', 'Insert new Odysee Bookmark'); },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': { 'sx': { ...THEME_LIGHT_PAPER_SX_PROPS } }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($17_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('59', 'Cancel'); },
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        get 'text'() { return t('60', 'Save'); },
        'onclickHandle': 'tuberCallbacks.$16_C_1'
      }
    }
  ],
  'open': true
};

export default newOdyseeBookmarkDialogState;

/**
 * Dark theme mode for form state to create a new Odysee video bookmark.
 * @id 16
 */
export const $16DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(newOdyseeBookmarkDialogState);
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
