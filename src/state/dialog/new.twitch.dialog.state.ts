import {
  TStateDialog
} from '@tuber/shared'
import {
  t,
  remove_form_suffix,
  clone_with_descriptors,
  clone_or_default
} from '../../business.logic'
import { register } from '../../business.logic/registry'
import STATE_KEY from '../../business.logic/state.key'

const $36 = STATE_KEY['36']
const $38 = STATE_KEY['38']

register('state', '36', $36)
/** Dialog to create a new Twitch video bookmark @id 36 */
const newTwitchBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '36',
  '_key': $36,
  get 'title'() { return t('64', 'Insert New Twitch Bookmark') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': {
        'overflowX': 'hidden !important'
      }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($38)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('65', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('66', 'Save') },
        'onclickHandler': 'tuberCallbacks.$36_C_1'
      }
    }
  ],
  'open': true
}

export default newTwitchBookmarkDialogState

/**
 * Dark theme mode for form state to create a new Twitch video bookmark.
 * @id 36
 */
export const $36DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(newTwitchBookmarkDialogState)
  const props = clone_or_default(base.props, {})
  const paperProps = clone_or_default(props.PaperProps, {})
  paperProps.sx = {
    ...paperProps.sx,
  }
  props.PaperProps = paperProps
  base.props = props
  return base
})()
