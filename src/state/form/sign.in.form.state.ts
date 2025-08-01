import { TStateForm } from '../../common.types';
import { register } from '../../business.logic/registry';
import { $41_STATE_KEY } from '../../constants';

register('state', '41', $41_STATE_KEY);
/** Form state to sign in. @id 41 */
const signInFormState: TStateForm = {
  '_type': 'box',
  '_id': '41',
  '_key': $41_STATE_KEY,
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
          'label': 'Username',
          'has': {
            'required': true,
            'requiredMessage': 'Type-in your username first'
          }
        },
        {
          'type': 'password',
          'label': 'Password',
          'name': 'password',
          'has': {
            'required': true,
            'requiredMessage': 'You forgot the password'
          }
        },
        {
          'type': 'checkboxes',
          'label': 'Available options',
          'name': 'options',
          'has': {
            'items': [
              {
                'name': 'keep-signed-in',
                'label': 'Keep me signed in'
              }
            ],
          }
        },
        {
          'type': 'submit',
          'has': {
            'icon': 'vpn_key',
            'iconPosition': 'right',
            'title': 'Sign in',
            'onclickHandle': 'tuberCallbacks.$41_C_1'
          }
        }
      ]
    }
  ]
};

export default signInFormState;

/** Dark theme mode form state to sign in. @id 41 */
export const $41DarkThemeMode = {
  ...signInFormState,
  // TODO - add dark theme mode overrides here
} as TStateForm;