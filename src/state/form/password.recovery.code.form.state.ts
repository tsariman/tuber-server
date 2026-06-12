import { type TStateForm, EP_AUTH } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { clone_with_descriptors, t } from '../../business.logic'
import STATE_KEY from '../../business.logic/state.key'
import {
  ADMIN_PANEL_FIELD_SX,
  ADMIN_PANEL_FORM_SX,
  ADMIN_PANEL_PRIMARY_ACTION_SX
} from './_state.form.admin.panel.styles'

const $93 = STATE_KEY['93']

register('state', '93', $93)
/** Form state to enter password recovery code sent via email. @id 93 */
export const passwordRecoveryCodeFormState: TStateForm = {
  '_type': 'box',
  '_id': '93',
  '_key': $93,
  'props': {
    'sx': ADMIN_PANEL_FORM_SX,
  },
  'paperBackground': true,
  'paperProps': { 'elevation': 24 },
  'items': [
    {
      'type': 'stack',
      'props': {
        'spacing': 2,
        'sx': { 'pt': 1 }
      },
      'items': [
        {
          'type': 'text',
          'name': 'email',
          get 'label'() { return t('email', 'Email') },
          'props': {
            'sx': { 'display': 'none' },
            'autoComplete': 'email',
            'type': 'email'
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no_email', 'Email is required.') },
            'validationRegex': '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            get 'validationMessage'() { return t('invalid_email', 'Please enter a valid email address.') }
          }
        },
        {
          'type': 'text',
          'name': 'code',
          get 'label'() { return t('recovery_code', 'Recovery Code') },
          'props': {
            'sx': ADMIN_PANEL_FIELD_SX,
            'autoComplete': 'off',
            'placeholder': t('code_placeholder', 'Enter the code from your email')
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no_recovery_code', 'Recovery code is required.') }
          }
        },
        {
          'type': 'submit',
          'props': {
            'type': 'submit',
            'sx': ADMIN_PANEL_PRIMARY_ACTION_SX
          },
          'has': {
            'icon': 'check_circle',
            'iconPosition': 'right',
            get 'title'() { return t('verify_code', 'Verify Code') },
            'onclickHandlerDirective': {
              'type': '$form',
              'formName': $93,
              'endpoint': EP_AUTH.VERIFY,
              'rules': [ 'disable_on_submit' ]
            }
          }
        }
      ]
    }
  ]
}

export default passwordRecoveryCodeFormState

/** Dark theme mode form state to enter password recovery code. @id 93 */
export const $93DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(passwordRecoveryCodeFormState)
  return base
})()
