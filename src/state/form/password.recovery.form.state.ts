import  { type TStateForm, EP_AUTH } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { clone_with_descriptors, t } from '../../business.logic'
import STATE_KEY from '../../business.logic/state.key'
import {
  ADMIN_PANEL_FIELD_SX,
  ADMIN_PANEL_FORM_SX,
  ADMIN_PANEL_PRIMARY_ACTION_SX
} from './_state.form.admin.panel.styles'

const $86 = STATE_KEY['86']

register('state', '86', $86)
/** Form state to request password recovery. @id 86 */
export const passwordRecoveryFormState: TStateForm = {
  '_type': 'box',
  '_id': '86',
  '_key': $86,
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
            'sx': ADMIN_PANEL_FIELD_SX,
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
          'type': 'submit',
          'props': {
            'type': 'submit',
            'sx': ADMIN_PANEL_PRIMARY_ACTION_SX
          },
          'has': {
            'icon': 'mail',
            'iconPosition': 'right',
            get 'title'() { return t('send_recovery_email', 'Send Recovery Email') },
            'onclickHandlerDirective': {
              'type': '$form',
              'formName': $86,
              'endpoint': EP_AUTH.RECOVERY,
              'rules': [ 'disable_on_submit' ]
            }
          }
        }
      ]
    }
  ]
}

export default passwordRecoveryFormState

/** Dark theme mode form state to request password recovery. @id 86 */
export const $86DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(passwordRecoveryFormState)
  return base
})()
