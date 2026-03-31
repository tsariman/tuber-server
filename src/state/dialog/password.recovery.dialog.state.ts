import { EP_AUTH, type TStateDialog } from '@tuber/shared'
import { clone_with_descriptors, remove_form_suffix, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import STATE_KEY from '../../business.logic/state.key'

const $85 = STATE_KEY['85']
const $86 = STATE_KEY['86']

register('state', '85', $85)
/** Password recovery dialog state. @id 85 */
export const passwordRecoveryDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '85',
  '_key': $85,
  get 'title'() { return t('recover_password', 'Recover Password') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'xs'
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($86)} : ${EP_AUTH.RECOVERY}`,
  'open': true
}

/** Dark theme mode for password recovery dialog state. @id 85 */
export const $85DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(passwordRecoveryDialogState)
  return base
})()

export default passwordRecoveryDialogState
