import { SxProps } from '@mui/material'
import  { type TStateForm, EP_AUTH } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { clone_with_descriptors, t } from '../../business.logic'
import STATE_KEY from '../../business.logic/state.key'

const $86 = STATE_KEY['86']

register('state', '86', $86)
/** Form state to request password recovery. @id 86 */
export const passwordRecoveryFormState: TStateForm = {
  '_type': 'box',
  '_id': '86',
  '_key': $86,
  'props': {
    'sx': {
      'p': 3,
      'width': '37ch',
    } as SxProps,
  },
  'paperBackground': true,
  'paperProps': { 'elevation': 24 },
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'text',
          'name': 'email',
          get 'label'() { return t('email', 'Email') },
          'props': {
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
            'type': 'submit'
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
