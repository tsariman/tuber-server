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

const $28 = STATE_KEY['28']
const $30 = STATE_KEY['30']

register('state', '30', $30)
/** Dialog to create a new Unknown video bookmark @id 30 */
const newUnknownBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '30',
  '_key': $30,
  get 'title'() { return t('67', 'Insert new Unknown Bookmark') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': {
        ...THEME_LIGHT_PAPER_SX_PROPS,
        'overflowX': 'hidden !important'
      }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($28)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('68', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        get 'text'() { return t('69', 'Save') },
        'onclickHandler': 'tuberCallbacks.$30_C_1'
      }
    }
  ],
  'open': true
}

export default newUnknownBookmarkDialogState

/**
 * Dark theme mode for form state to create a new Unknown video bookmark.
 * @id 30
 */
export const $30DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(newUnknownBookmarkDialogState)
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
