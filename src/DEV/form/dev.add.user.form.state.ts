import { TBootstrapState } from 'src/state/_state.common.types';
import { TStateForm } from '@tuber/shared';

/** @deprecated */
export const devUserAddFormJson: TStateForm = {
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
};

const dev_add_user_form_state = {

  'devUserAddForm': {
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

  // TODO - Insert form states here.

} as TBootstrapState<TStateForm>;

export default dev_add_user_form_state;