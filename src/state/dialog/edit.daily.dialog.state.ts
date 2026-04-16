import {
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
} from '@tuber/shared'
import {
  t,
  remove_form_suffix,
  clone_with_descriptors
} from '../../business.logic'
import { TStateDialog } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { THEME_LIGHT_PAPER_SX_PROPS } from '../theme.state'
import STATE_KEY from '../../business.logic/state.key'

const $20 = STATE_KEY['20']
const $22 = STATE_KEY['22']

register('state', '22', $22)
/** Dialog to edit an existing Dailymotion video bookmark @id 22 */
const editDailyBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '22',
  '_key': $22,
  get 'title'() { return t('9', 'Edit Dailymotion Bookmark') },
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
  'content': `$form : ${remove_form_suffix($20)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('10', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('11', 'Save') },
        'onclickHandler': 'tuberCallbacks.$22_C_1'
      }
    }
  ],
  'open': true
}

export default editDailyBookmarkDialogState

/**
 * Dark theme mode for form state to edit an existing dailymotion video
 * bookmark.
 * @id 22
 */
export const $22DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(editDailyBookmarkDialogState)
  const props = clone_with_descriptors(editDailyBookmarkDialogState.props ?? {})
  const paperProps = clone_with_descriptors(props.PaperProps ?? {})
  const sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  } as typeof paperProps['sx']
  paperProps.sx = sx
  props.PaperProps = paperProps
  base.props = props
  return base
})()
