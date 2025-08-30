import { SxProps } from '@mui/material';
import { TStateForm } from '../../shared';
import { register } from '../../business.logic/registry';
import { $41_STATE_KEY } from '../../constants.server';
import { clone_with_descriptors, t } from '../../business.logic';

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
          'name': 'username',
          get 'label'() { return t('278', 'Username'); },
          'has': {
            'required': true,
            'requiredMessage': 'Type-in your username first'
          }
        },
        {
          'type': 'password',
          get 'label'() { return t('277', 'Password'); },
          'name': 'password',
          'has': {
            'required': true,
            'requiredMessage': 'You forgot the password'
          }
        },
        {
          'type': 'checkboxes',
          get 'label'() { return t('276', 'Available options'); },
          'name': 'options',
          'has': {
            'items': [
              {
                'name': 'keep-signed-in',
                get 'label'() { return t('274', 'Keep me signed in'); }
              }
            ],
          }
        },
        {
          'type': 'submit',
          'has': {
            'icon': 'vpn_key',
            'iconPosition': 'right',
            get 'title'() { return t('275', 'Sign in'); },
            'onclickHandle': 'tuberCallbacks.$41_C_1'
          }
        }
      ]
    }
  ]
};

export default signInFormState;

/** Dark theme mode form state to sign in. @id 41 */
export const $41DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(signInFormState);
  return base;
})();
