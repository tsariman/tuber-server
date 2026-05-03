import { EP_AUTH, type TStateDialog } from '@tuber/shared'
import { clone_with_descriptors, remove_form_suffix, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import STATE_KEY from '../../business.logic/state.key'

const $95 = STATE_KEY['95']
const $89 = STATE_KEY['89']

register('state', '95', $95)
/** Password reset dialog state. @id 95 */
export const passwordResetDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '95',
  '_key': $95,
  get 'title'() { return t('reset_password_title', 'Choose a New Password') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'xs'
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($89)} : ${EP_AUTH.RESET}`,
  'open': true
}

/** Dark theme mode for password reset dialog state. @id 95 */
export const $95DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(passwordResetDialogState)
  return base
})()

export default passwordResetDialogState
