import { $69_STATE_KEY } from '../../constants'
import { TStateForm } from '../../common.types'
import Config from '../../config'

Config.register('state', '69', $69_STATE_KEY)
/** Form state to register a new user. @id 69 */
const registerFormState: TStateForm = {
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
          'name': 'name',
          'label': 'Username'
        },
        {
          'type': 'text',
          'label': 'First Name',
          'name': 'firstname'
        },
        {
          'type': 'text',
          'label': 'Last Name',
          'name': 'lastname'
        },
        {
          'type': 'text',
          'label': 'Email',
          'name': 'email'
        },
        {
          'type': 'html',
          'has': {
            'content': `<h3>Password/h3> <p>Your randomly generated password 
              will be emailed to you.</p>
            `
          }
        },
        
        {
          'type': 'submit',
          'has': {
            'icon': 'vpn_key',
            'iconPosition': 'right',
            'title': 'Sign in'
          }
        }
      ]
    }
  ]
}

export default registerFormState

/** Dark theme mode form state to register a new user. @id 69 */
export const $69DarkThemeMode = {
  ...registerFormState,
  // TODO Implement dark theme version of state here.
} as TStateForm