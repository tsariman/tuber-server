import { type TStateDialog } from '@tuber/shared'
import { clone_with_descriptors, remove_form_suffix, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import STATE_KEY from '../../business.logic/state.key'

const $87 = STATE_KEY['87']
const $88 = STATE_KEY['88']

register('state', '87', $87)
/** Feedback dialog state. @id 87 */
export const feedbackDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '87',
  '_key': $87,
  get 'title'() { return t('feedback_dialog_title', 'Feedback') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'sm',
    'PaperProps': {
      'sx': {
        'overflowX': 'hidden !important'
      }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($88)} : feedbacks`,
  'open': true
}

/** Dark theme mode for feedback dialog state. @id 87 */
export const $87DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(feedbackDialogState)
  return base
})()

export default feedbackDialogState
