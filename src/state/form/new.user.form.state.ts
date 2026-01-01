import { SxProps } from '@mui/material'
import { $69_STATE_KEY, TStateForm } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { clone_with_descriptors, t } from '../../business.logic'
import { title_centered } from '../html'
import Config from '../../config'

register('state', '69', $69_STATE_KEY)
/** Form state to create a new user account. @id 69 */
const newUserFormState: TStateForm = {
  '_id': '69',
  '_key': $69_STATE_KEY,
  '_type': 'box',
  'props': {
    'sx': { 'p': 3, 'width': '37ch' } as SxProps,
  },
  'paperBackground': true,
  'paperProps': { 'elevation': 24, 'sx': { 'm': 6 } },
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'html',
          'has': {
            get 'content'() {
              return title_centered(t('create_acount', 'Create an Account'))
            }
          }
        },
        {
          'type': 'text',
          'name': 'name',
          get 'label'() { return t('username', 'Username') },
          'props': { 'autoComplete': 'off' },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no_username', 'A username is required.') },
            'validationRegex': '^[a-zA-Z0-9_-]{3,21}$',
            get 'validationMessage'() { return t('invalid_username', 'Username must be 3-21 characters long and contain only letters, numbers, underscores, and hyphens.') },
          }
        },
        {
          'type': 'text',
          'name': 'firstname',
          get 'label'() { return t('firstname', 'First Name') },
          'props': { 'autoComplete': 'off' },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no_firstname', 'Your first name is required.') },
            'validationRegex': '^[a-zA-Z\\s\\-\']{1,21}$',
            get 'validationMessage'() { return t('invalid_firstname', 'First name must be 1-21 characters and contain only letters, spaces, hyphens, and apostrophes.') }
          }
        },
        {
          'type': 'text',
          'name': 'lastname',
          get 'label'() { return t('last_name', 'Last Name') },
          'props': { 'autoComplete': 'off' },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no_lastname', 'Your last name is required.') },
            'validationRegex': '^[a-zA-Z\\s\\-\']{1,21}$',
            get 'validationMessage'() { return t('invalid_lastname', 'Last name must be 1-21 characters and contain only letters, spaces, hyphens, and apostrophes.') }
          }
        },
        {
          'type': 'text',
          'name': 'email',
          get 'label'() { return t('email', 'Email') },
          'props': { 'autoComplete': 'email', 'type': 'email' },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no_email', 'Email is required.') },
            'validationRegex': '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            get 'validationMessage'() { return t('invalid_email', 'Please enter a valid email address.') }
          }
        },
        {
          'type': 'password',
          'name': 'password',
          get 'label'() { return t('password', 'Password') },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no_password', 'You forgot the password.') },
            // At least 12 chars, with upper, lower, number, and symbol
            'validationRegex': Config.DEV ? undefined : '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_+\\-\\[\\]{};:\\"\\|,.<>/?]).{12,}$',
            get 'validationMessage'() { return t('weak_password', 'Password must be at least 12 characters and include uppercase, lowercase, numbers, and symbols.') },
            'mustMatch': 're_entered_password',
            get 'mustMatchMessage'() { return t('password_mismatch', 'Passwords do not match.') }
          }
        },
        {
          'type': 'password',
          'name': 're_entered_password',
          get 'label'() { return t('password', 'Re-enter Password') },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no_password', 'You forgot the password.') },
            'mustMatch': 'password',
            get 'mustMatchMessage'() { return t('password_mismatch', 'Passwords do not match.') }
          }
        },
        // {
        //   'type': 'html',
        //   'has': {
        //     get 'content'() { 
        //       return `
        //         ${title_centered(t('69_help_email1', 'Email Verification'), 'h2')}
        //         ${paragraph(t('69_help_email2', `Don't forget to check your email so it can be verified.`))}
        //       `
        //     }
        //   }
        // },
        {
          'type': 'submit',
          'has': {
            'icon': 'vpn_key',
            'iconPosition': 'right',
            get 'title'() { return t('signup', 'Sign up') },
            'onclickHandlerDirective': {
              'type': '$form',
              'formName': $69_STATE_KEY,
              'endpoint': 'users',
              'rules': [ 'disable_on_submit' ]
            }
          }
        }
      ]
    }
  ]
}

export default newUserFormState

/** Dark theme mode form state to register a new user. @id 69 */
export const $69DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newUserFormState)
  return base
})()