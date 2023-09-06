import IStateForm from "../../../tuber-client/src/controllers/interfaces/IStateForm"

const devInstallForm: IStateForm = {
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
    }
  ]
}

export default devInstallForm