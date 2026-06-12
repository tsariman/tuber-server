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

const $19 = STATE_KEY['19']
const $21 = STATE_KEY['21']

register('state', '21', $21)
/** Dialog to create a new Dailymotion video bookmark @id 21 */
const newDailyBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '21',
  '_key': $21,
  get 'title'() { return t('52', 'Insert New Dailymotion Bookmark') },
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
  'content': `$form : ${remove_form_suffix($19)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('53', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('54', 'Save') },
        'onclickHandler': 'tuberCallbacks.$21_C_1'
      }
    }
  ],
  'open': true
}

export default newDailyBookmarkDialogState

/**
 * Dark theme mode for form state to create a new dailymotion video bookmark.
 * @id 21
 */
export const $21DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(newDailyBookmarkDialogState)
  const props = clone_or_default(base.props, {})
  const paperProps = clone_or_default(props.PaperProps, {})
  paperProps.sx = {
    ...paperProps.sx,
  }
  props.PaperProps = paperProps
  base.props = props
  return base
})()