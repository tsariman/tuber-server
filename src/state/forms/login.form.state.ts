import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'

const loginFormState: IStateForm = {
  '_type': 'box',
  '_key': 'loginForm',
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
          'label': 'Username'
        },
        {
          'type': 'password',
          'label': 'Password',
          'name': 'password'
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