import {
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  TStateDialog
} from '@tuber/shared'
import {
  t,
  remove_form_suffix,
  clone_with_descriptors
} from '../../business.logic'
import { register } from '../../business.logic/registry'
import { THEME_LIGHT_PAPER_SX_PROPS } from '../theme.state'
import STATE_KEY from '../../business.logic/state.key'

const $37 = STATE_KEY['37']
const $39 = STATE_KEY['39']

register('state', '37', $37)
/** Dialog to edit an existing Twitch video bookmark @id 37 */
const editTwitchBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '37',
  '_key': $37,
  get 'title'() { return t('21', 'Edit Twitch Bookmark') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': { 'sx': { ...THEME_LIGHT_PAPER_SX_PROPS } },
    'sx': { 'overflowX': 'hidden' }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($39)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('22', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('23', 'Save') },
        'onclickHandler': 'tuberCallbacks.$37_C_1'
      }
    }
  ],
  'open': true
}

export default editTwitchBookmarkDialogState

/**
 * Dark theme mode for form state to edit an existing Twitch video
 * bookmark.
 * @id 37
 */
export const $37DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(editTwitchBookmarkDialogState)
  const props = clone_with_descriptors(base.props ?? {})
  const paperProps = clone_with_descriptors(props.PaperProps ?? {})
  const sx: typeof paperProps['sx'] = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  }
  paperProps.sx = sx
  props.PaperProps = paperProps
  base.props = props
  return base
})()
