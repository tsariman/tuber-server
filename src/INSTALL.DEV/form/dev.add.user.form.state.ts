import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'

export const devUserAddFormJson: IStateForm = {
  '_type': 'box',
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
          'type': 'text',
          'name': 'email',
          'label': 'Email'
        },
        {
          'type': 'state_select',
          'has': {
            'text': 'Role',
            'items': [
              {
                'title': 'User',
                'value': 'user'
              },
              {
                'title': 'Moderator',
                'value': 'moderator'
              },
              {
                'title': 'Administrator',
                'value': 'administrator'
              },
              {
                'title': 'Developer',
                'value': 'developer'
              },
              {
                'title': 'Owner',
                'value': 'owner'
              },
            ]
          }
        },
        {
          'type': 'password',
          'name': 'password',
          'label': 'Password'
        },
        {
          'type': 'submit',
          'has': {
            'title': 'Create User'
          }
        }
      ]
    }
  ]
}