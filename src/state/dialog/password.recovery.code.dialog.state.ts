import { EP_AUTH, type TStateDialog } from '@tuber/shared'
import { clone_with_descriptors, remove_form_suffix, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import STATE_KEY from '../../business.logic/state.key'

const $94 = STATE_KEY['94']
const $93 = STATE_KEY['93']

register('state', '94', $94)
/** Password recovery code verification dialog state. @id 94 */
export const passwordRecoveryCodeDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '94',
  '_key': $94,
  get 'title'() { return t('verify_recovery_code', 'Verify Recovery Code') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'xs'
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($93)} : ${EP_AUTH.VERIFY}`,
  'open': true
}

/** Dark theme mode for password recovery code dialog state. @id 94 */
export const $94DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(passwordRecoveryCodeDialogState)
  return base
})()

export default passwordRecoveryCodeDialogState
