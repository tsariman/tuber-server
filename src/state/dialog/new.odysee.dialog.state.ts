import {
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  TStateDialog
} from '@tuber/shared'
import {
  t,
  remove_form_suffix,
  clone_with_descriptors,
  clone_or_default
} from '../../business.logic'
import { register } from '../../business.logic/registry'
import { THEME_LIGHT_PAPER_SX_PROPS } from '../theme.state'
import STATE_KEY from '../../business.logic/state.key'

const $16 = STATE_KEY['16']
const $17 = STATE_KEY['17']

register('state', '16', $16)
/** Dialog to create a new Odysee video bookmark @id 16 */
const newOdyseeBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '16',
  '_key': $16,
  get 'title'() { return t('58', 'Insert new Odysee Bookmark') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': { 'sx': { ...THEME_LIGHT_PAPER_SX_PROPS } },
    'sx': { 'overflowX': 'hidden' }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($17)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('59', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        get 'text'() { return t('60', 'Save') },
        'onclickHandler': 'tuberCallbacks.$16_C_1'
      }
    }
  ],
  'open': true
}

export default newOdyseeBookmarkDialogState

/**
 * Dark theme mode for form state to create a new Odysee video bookmark.
 * @id 16
 */
export const $16DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(newOdyseeBookmarkDialogState)
  const props = clone_or_default(base.props, {})
  const paperProps = clone_or_default(props.PaperProps, {})
  paperProps.sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  }
  props.PaperProps = paperProps
  base.props = props
  return base
})()
