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

const $25 = STATE_KEY['25']
const $27 = STATE_KEY['27']

register('state', '27', $27)
/** Dialog to edit a Facebook video bookmark @id 27 */
const editFacebookBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '27',
  '_key': $27,
  get 'title'() { return t('12', 'Edit Facebook Bookmark') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': { 'sx': { ...THEME_LIGHT_PAPER_SX_PROPS } },
    'sx': { 'overflowX': 'hidden' }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($25)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('13', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        get 'text'() { return t('14', 'Save') },
        'onclickHandler': 'tuberCallbacks.$27_C_1'
      }
    }
  ],
  'open': true
}

export default editFacebookBookmarkDialogState

/**
 * Dark theme mode for form state to edit an existing Facebook video
 * bookmark.
 * @id 27
 */
export const $27DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(editFacebookBookmarkDialogState)
  const props = clone_with_descriptors(base.props ?? {})
  const paperProps = clone_with_descriptors(props.PaperProps ?? {})
  const sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  } as typeof paperProps.sx
  paperProps.sx = sx
  props.PaperProps = paperProps
  base.props = props
  return base
})()
