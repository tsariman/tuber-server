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

const $14 = STATE_KEY['14']
const $12 = STATE_KEY['12']

register('state', '14', $14)
/** Dialog to create a new Vimeo video bookmark @id 14 */
const newVimeoBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '14',
  '_key': $14,
  get 'title'() { return t('70', 'Insert New Vimeo Bookmark') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': { 'sx': { ...THEME_LIGHT_PAPER_SX_PROPS } },
    'sx': { 'overflowX': 'hidden' }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($12)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('71', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('72', 'Save') },
        'onclickHandler': 'tuberCallbacks.$14_C_1'
      }
    }
  ],
  'open': true
}

export default newVimeoBookmarkDialogState

/**
 * Dark theme mode for form state to create a new Vimeo video bookmark.
 * @id 14
 */
export const $14DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(newVimeoBookmarkDialogState)
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
