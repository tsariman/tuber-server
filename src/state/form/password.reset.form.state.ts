import { SxProps } from '@mui/material'
import { EP_AUTH, type TStateForm } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { clone_with_descriptors, t } from '../../business.logic'
// import { title_centered } from '../html'
import STATE_KEY from '../../business.logic/state.key'

const $89 = STATE_KEY['89']

register('state', '89', $89)
/** Form state to reset a password with an emailed recovery token. @id 89 */
export const passwordResetFormState: TStateForm = {
  '_type': 'box',
  '_id': '89',
  '_key': $89,
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
        // {
        //   'type': 'html',
        //   'has': {
        //     get 'content'() {
        //       return title_centered(t('reset_password_title', 'Choose a New Password'))
        //     }
        //   }
        // },
        // {
        //   'type': 'html',
        //   'has': {
        //     get 'content'() {
        //       return '<p style="margin:0;text-align:center;opacity:.85;">Open the link from your email and finish resetting your password.</p>'
        //     }
        //   }
        // },
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
            get 'validationMessage'() { return t('invalid_email', 'Please enter a valid email address.') },
            'defaultValue': '$query.email'
          }
        },
        {
          'type': 'text',
          'name': 'token',
          get 'label'() { return t('recovery_token', 'Recovery Token') },
          'props': {
            'sx': { 'display': 'none' },
            'autoComplete': 'off'
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no_token', 'Recovery token is required.') },
            'defaultValue': '$query.token'
          }
        },
        {
          'type': 'password',
          'name': 'password',
          get 'label'() { return t('new_password', 'New Password') },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no_password', 'You forgot the password.') },
            'validationRegex': '^.{8,}$',
            get 'validationMessage'() { return t('weak_password', 'Password must be at least 8 characters long.') },
            'mustMatch': 're_entered_password',
            get 'mustMatchMessage'() { return t('password_mismatch', 'Passwords do not match.') }
          }
        },
        {
          'type': 'password',
          'name': 're_entered_password',
          get 'label'() { return t('re_enter_password', 'Re-enter Password') },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no_password', 'You forgot the password.') },
            'mustMatch': 'password',
            get 'mustMatchMessage'() { return t('password_mismatch', 'Passwords do not match.') }
          }
        },
        {
          'type': 'submit',
          'props': {
            'type': 'submit'
          },
          'has': {
            'icon': 'vpn_key',
            'iconPosition': 'right',
            get 'title'() { return t('reset_password_submit', 'Reset Password') },
            'onclickHandlerDirective': {
              'type': '$form',
              'formName': $89,
              'endpoint': EP_AUTH.RESET,
              'rules': [ 'disable_on_submit' ]
            }
          }
        }
      ]
    }
  ]
}

export default passwordResetFormState

/** Dark theme mode form state to reset password. @id 89 */
export const $89DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(passwordResetFormState)
  return base
})()
