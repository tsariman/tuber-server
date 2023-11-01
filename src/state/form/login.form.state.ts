import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { $41_KEY } from '../../constants'

const $41 = '41'
Config.register('state', $41, $41_KEY)
/** @id 41 */
const loginFormState: IStateForm = {
  '_type': 'box',
  '_id': $41,
  '_key': $41_KEY,
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
                'name': 'keep-logged-in',
                'label': 'Keep me logged in'
              }
            ],
          }
        },
        {
          'type': 'submit',
          'has': {
            'icon': 'vpn_key',
            'iconPosition': 'right',
            'title': 'Login'
          }
        }
      ]
    }
  ]
}

export default loginFormState