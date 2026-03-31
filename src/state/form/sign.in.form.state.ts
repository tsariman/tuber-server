import { SxProps } from '@mui/material'
import type { TStateForm } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { clone_with_descriptors, t } from '../../business.logic'
import STATE_KEY from '../../business.logic/state.key'
import { passwordRecoveryDialogState } from '../dialog/password.recovery.dialog.state'

const $41 = STATE_KEY['41']

register('state', '41', $41)
/** Form state to sign in. @id 41 */
export const signInFormState: TStateForm = {
  '_type': 'box',
  '_id': '41',
  '_key': $41,
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
          get 'label'() { return t('278', 'Username') },
          'props': { 'autoComplete': 'off' },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('required_username', 'Type-in your username first') }
          }
        },
        {
          'type': 'password',
          get 'label'() { return t('277', 'Password') },
          'name': 'password',
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('no-password', 'You forgot the password') }
          }
        },
        {
          'type': 'div',
          'props': { 'sx': {
            'mt': '0 !important',
            'textAlign': 'right'
          }},
          'items': [
            {
              'type': 'a',
              'props': {
                'href': '#forgot-password',
                'sx': {
                  'mt': '0 !important',
                  'fontSize': '0.875rem',
                  'textDecoration': 'none',
                  '&:hover': {
                    'textDecoration': 'underline'
                  }
                }
              },
              'has': {
                get 'text'() { return t('279', 'Forgot password?') },
                'onclickHandlerDirective': {
                  'type': '$redux_actions',
                  'actions': [
                    { 'type': 'dialog/dialogClose' },
                    { 'type': 'dialog/dialogOpenOrMount', 'payload': passwordRecoveryDialogState }
                  ]
                }
              }
            },
          ]
        },
        {
          'type': 'checkboxes',
          get 'label'() { return t('276', 'Available options') },
          'name': 'options',
          'has': {
            'items': [
              {
                'name': 'keep-signed-in',
                get 'label'() { return t('274', 'Keep me signed in') }
              }
            ],
          }
        },
        {
          'type': 'submit',
          'props': { 'type': 'submit' },
          'has': {
            'icon': 'vpn_key',
            'iconPosition': 'right',
            get 'title'() { return t('275', 'Sign in') },
            'onclickHandler': 'tuberCallbacks.$41_C_1'
          }
        }
      ]
    }
  ]
}

export default signInFormState

/** Dark theme mode form state to sign in. @id 41 */
export const $41DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(signInFormState)
  return base
})()
