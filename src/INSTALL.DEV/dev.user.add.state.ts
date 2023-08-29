import IStateDialog from '../../../tuber-client/src/controllers/interfaces/IStateDialog'
import IStateForm from '../../../tuber-client/src/controllers/interfaces/IStateForm'

export const devUserAddDialogJson: IStateDialog = {
  '_type': 'form',
  '_name': 'devUserAddDialog',
  'title': 'Create New User',
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': '$form : devUserAdd : users',
  'open': true // Dialog will open automatically
}

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
          'type': 'json_select',
          'text': 'Role',
          'has': {
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