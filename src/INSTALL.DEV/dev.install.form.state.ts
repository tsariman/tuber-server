import IStateForm from '../../../tuber-client/src/controllers/interfaces/IStateForm'

/** Development shortcuts form. */

const devInstallForm = {
  '_type': 'box',
  '_key': 'devInstallForm',
  'props': { 'p': 2, 'mt': 10 },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': { 'backgroundColor': '#dddddd' }
  },
  'items': [
    {
      'type': 'html',
      'props': { 'sx': { 'textAlign': 'center' } },
      'has': {
        'content': '<h2>Development Shortcuts</h2>'
      }
    },
    {
      'type': 'html',
      'props': { 'sx': { } },
      'has': {
        'content': `
          <p>
            <em>Use these shortcuts to quickly test the application.</em>
            <em>These shortcuts are not available in production.</em>
          </p>
          <h3>Collections</h3>
          <p>
            &#128172;<span style="color:#0074d8"><b>Notes</b></span> <em>({{ noteCount }})</em>
            <br />
            &#128526;<span style="color:#0074d8"><b>Users</b></span> <em>({{ userCount }})</em>
          </p>
        `,
        'key': 'devInstallForm'
      }
    },
    {
      'type': 'json_button',
      'has': {
        'label': 'Create dev user',
        'handle': 'onclick : tuberCallbacks.devCreateUser'
      },
    },
    { 'type': 'html',
      'props': { 'sx': { 'display': 'inline' } },
      'has': { 'content': '|' }
    },
    {
      'type': 'json_button',
      'has': {
        'label': 'Reset database',
        'handle': 'onclick : tuberCallbacks.devResetDatabase'
      }
    },
    { 'type': 'html',
      'props': { 'sx': { 'display': 'inline' } },
      'has': { 'content': '|' }
    },
    {
      'type': 'json_button',
      'has': {
        'label': 'Test Drawer',
        'handle': 'onclick : tuberCallbacks.devLoadDrawer'
      }
    },
    { 'type': 'html',
      'props': { 'sx': { 'display': 'inline' } },
      'has': { 'content': '|' }
    },
    {
      'type': 'json_button',
      'has': {
        'label': 'Remove Drawer',
        'handle': 'onclick : tuberCallbacks.devUnloadDrawer'
      }
    },
    { 'type': 'html',
      'props': { 'sx': { 'display': 'inline' } },
      'has': { 'content': '|' }
    },
    {
      'type': 'json_button',
      'has': {
        'label': 'Test Add New Note',
        'handle': 'onclick : tuberCallbacks.noteAdd'
      }
    },
    { 'type': 'hr' },
    {
      'type': 'stack',
      'props': {
        'direction': 'row',
        'spacing': 1
      },
      'items': [
        {
          'type': 'textfield',
          'name': 'clipboard-test',
          'label': 'Clipboard Test',
          'has': {
            
          },
          'props': {
            'variant': 'filled',
            'fullWidth': true
          }
        },
        {
          'type': 'json_button',
          'has': {
            'text': 'Test Clipboard',
            'handle': 'onclick : tuberCallbacks.devClipboardTest'
          },
          'props': {
            'variant': 'contained',
            'size': 'small',
            'disableElevation': true
          }
        }
      ]
    },
    { 'type': 'hr' },
    {
      'type': 'json_button',
      'has': {
        'label': 'Create new user',
        'handle': 'onClick : tuberCallbacks.devUserAdd'
      }
    },
    { 'type': 'html',
      'props': { 'sx': { 'display': 'inline' } },
      'has': { 'content': '|' }
    },
    {
      'type': 'json_button',
      'has': {
        'label': 'Populate user collection',
        'handle': 'onclick : tuberCallbacks.devUserPopulate'
      }
    },
    { 'type': 'html',
      'props': { 'sx': { 'display': 'inline' } },
      'has': { 'content': '|' }
    },
    {
      'type': 'json_button',
      'has': {
        'label': 'Get notes collection test',
        'handle': 'onclick : tuberCallbacks.devGetNotes'
      }
    },
    {
      'type': 'html',
      'props': { 'sx': { 'display': 'inline' } },
      'has': { 'content': '|' }
    },
    {
      'type': 'json_button',
      'has': {
        'label': 'Test spinner',
        'handle': 'onclick : tuberCallbacks.devNoResponse'
      }
    },
    {
      'type': 'html',
      'props': { 'sx': { 'display': 'inline' } },
      'has': { 'content': '|' }
    },
    {
      'type': 'stack',
      'props': {
        'direction': 'row',
        'spacing': 1
      },
      'items': [
        {
          'type': 'json_select',
          'name': 'drop-collection',
          'label': 'Drop Collection',
          'props': {
            'variant': 'filled',
            'size': 'lg',
          },
          'has': {
            'formControlProps': {
              'sx': { 'm': 1, 'minWidth': 200 }
            },
            'inputLabelProps': {
              'sx': { 'm': 1 }
            },
            'items': [
              { 'label': 'Notes', 'value': 'notes' },
              { 'label': 'Users', 'value': 'users' }
            ]
          }
        },
        {
          'type': 'json_button',
          'has': {
            'label': 'Drop Collection',
            'handle': 'onclick : tuberCallbacks.devDropCollection'
          },
          'props': {
            'variant': 'contained',
            'size': 'small',
            'disableElevation': true
          }
        },
        {
          'type': 'html',
          'props': { 'sx': { 'display': 'inline' } },
          'has': { 'content': '|' }
        },
        {
          'type': 'json_select',
          'name': 'populate-collection',
          'label': 'Populate Collection',
          'props': {
            'variant': 'filled',
            'size': 'lg',
          },
          'has': {
            'formControlProps': {
              'sx': { 'm': 1, 'minWidth': 200 }
            },
            'inputLabelProps': {
              'sx': { 'm': 1 }
            },
            'items': [
              { 'label': 'Notes', 'value': 'notes' },
              { 'label': 'Users', 'value': 'users' }
            ]
          }
        },
        {
          'type': 'json_select',
          'name': 'population-quantity',
          'label': 'Population Quantity',
          'props': {
            'variant': 'filled',
            'size': 'lg',
          },
          'has': {
            'formControlProps': {
              'sx': { 'm': 1, 'minWidth': 200 }
            },
            'inputLabelProps': {
              'sx': { 'm': 1 }
            },
            'items': [
              { 'label': '50', 'value': '50' },
              { 'label': '100', 'value': '100' },
              { 'label': '200', 'value': '200' },
              { 'label': '500', 'value': '500' },
              { 'label': '1000', 'value': '1000' },
            ]
          }
        },
        {
          'type': 'json_button',
          'has': {
            'label': 'Populate Collection',
            'handle': 'onclick : tuberCallbacks.devPopulateCollection'
          },
          'props': {
            'variant': 'contained',
            'size': 'small',
            'disableElevation': true
          }
        },
      ]
    },
  ]
} as IStateForm

export default devInstallForm