import {
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  TStateDialog
} from '@tuber/shared'
import {
  t,
  remove_form_suffix,
  clone_or_default
} from '../../business.logic'
import { register } from '../../business.logic/registry'
import { THEME_LIGHT_PAPER_SX_PROPS } from '../theme.state'
import STATE_KEY from '../../business.logic/state.key'

const $13 = STATE_KEY['13']
const $15 = STATE_KEY['15']

register('state', '15', $15)
/** Dialog to edit an existing Vimeo video bookmark @id 15 */
const editVimeoBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '15',
  '_key': $15,
  get 'title'() { return t('27', 'Edit Vimeo Bookmark') },
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
  'content': `$form : ${remove_form_suffix($13)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('28', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('29', 'Save') },
        'onclickHandler': 'tuberCallbacks.$15_C_1'
      }
    }
  ],
  'open': true
}

export default editVimeoBookmarkDialogState

/**
 * Dark theme mode for form state to edit an existing Vimeo video
 * bookmark.
 * @id 15
 */
export const $15DarkThemeMode: TStateDialog = (() => {
  const base = clone_or_default(editVimeoBookmarkDialogState, {})
  const props = clone_or_default(base.props, {})
  const paperProps = clone_or_default(props.PaperProps, {})
  const sx: typeof paperProps['sx'] = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  }
  paperProps.sx = sx
  props.PaperProps = paperProps
  base.props = props
  return base
})()
