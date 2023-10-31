import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'

const registerFormState: IStateForm = {
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
            'title': 'Login'
          }
        }
      ]
    }
  ]
}

export default registerFormState