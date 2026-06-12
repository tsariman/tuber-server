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

const $8 = STATE_KEY['8']
const $9 = STATE_KEY['9']

register('state', '8', $8)
/** Dialog to create a new Rumble video bookmark @id 8 */
const newRumbleBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '8',
  '_key': $8,
  get 'title'() { return t('61', 'Insert new Rumble Bookmark') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': {
        'overflowX': 'hidden'
      }
    },
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($9)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('62', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        get 'text'() { return t('63', 'Save') },
        'onclickHandler': 'tuberCallbacks.$8_C_1'
      }
    }
  ],
  'open': true
}

export default newRumbleBookmarkDialogState

/**
 * Dark theme mode for form state to create a new Rumble video bookmark.
 * @id 8
 */
export const $8DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(newRumbleBookmarkDialogState)
  const props = clone_or_default(base.props, {})
  const paperProps = clone_or_default(props.PaperProps, {})
  paperProps.sx = {
    ...paperProps.sx,
  }
  props.PaperProps = paperProps
  base.props = props
  return base
})()
