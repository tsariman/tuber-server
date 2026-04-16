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

const $10 = STATE_KEY['10']
const $11 = STATE_KEY['11']

register('state', '11', $11)
/** Dialog to edit a Rumble video bookmark @id 11 */
const editRumbleBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '11',
  '_key': $11,
  get 'title'() { return t('18', 'Edit Rumble Bookmark') },
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
  'content': `$form : ${remove_form_suffix($10)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('19', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        get 'text'() { return t('20', 'Save') },
        'onclickHandler': 'tuberCallbacks.$11_C_1'
      }
    }
  ],
  'open': true
}

export default editRumbleBookmarkDialogState

/**
 * Dark theme mode for form state to edit an existing Rumble video
 * bookmark.
 * @id 11
 */
export const $11DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(editRumbleBookmarkDialogState)
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