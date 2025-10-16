import { $69_STATE_KEY } from '../../constants.server';
import { TStateForm } from '../../shared';
import { register } from '../../business.logic/registry';
import { clone_with_descriptors, t } from '../../business.logic';

register('state', '69', $69_STATE_KEY);
/** Form state to create a new user account. @id 69 */
const newUserFormState: TStateForm = {
  '_id': '69',
  '_key': $69_STATE_KEY,
  '_type': 'box',
  'props': {
    'sx': {
      'p': 3,
      'width': '37ch',
    },
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
          'name': 'username',
          get 'label'() { return t('username', 'Username'); },
          'props': { 'autoComplete': 'off' },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('nousername', 'A username is required.'); }
          }
        },
        {
          'type': 'text',
          'name': 'firstname',
          get 'label'() { return t('first_name', 'First Name'); },
          'props': { 'autoComplete': 'off' },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('nofirstname', 'Your first name is required.'); }
          }
        },
        {
          'type': 'text',
          'name': 'lastname',
          get 'label'() { return t('last_name', 'Last Name'); },
          'props': { 'autoComplete': 'off' },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('nolastname', 'Your last name is required.'); }
          }
        },
        {
          'type': 'text',
          'name': 'email',
          get 'label'() { return t('email', 'Email'); },
          'props': { 'autoComplete': 'off' },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('noemail', 'Email is required.'); }
          }
        },
        {
          'type': 'password',
          'name': 'password',
          get 'label'() { return t('password', 'Password'); },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('nopassword', 'You forgot the password.'); }
          }
        },
        {
          'type': 'password',
          'name': 're_enter_password',
          get 'label'() { return t('password', 'Re-enter Password'); },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('nopassword', 'You forgot the password.'); }
          }
        },
        {
          'type': 'html',
          'has': {
            'content': `<h3>Email Verification/h3> <p>Don't forget to check 
            your email so it can be verified.</p>
            `
          }
        },
        {
          'type': 'submit',
          'has': {
            'icon': 'vpn_key',
            'iconPosition': 'right',
            get 'title'() { return t('signup', 'Sign up'); }
          }
        }
      ]
    }
  ]
};

export default newUserFormState;

/** Dark theme mode form state to register a new user. @id 69 */
export const $69DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newUserFormState);
  return base;
})();