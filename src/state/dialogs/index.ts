import { background } from '..'
import IStateAllDialogs from '../../../../tuber-client/src/controllers/interfaces/IStateAllDialogs'

const dialogs: IStateAllDialogs = {}

dialogs['noteAddDialog'] = {
  '_type': 'form',
  '_id': 'pro-insert-new-note',
  'title': 'Insert New Note',
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': { 'backgroundColor': background.color }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': '$form:newNote:notes',
  'actions': [
    {
      'type': 'json_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': 'Cancel',
        'handle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'json_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': 'Save',
        'handle': ''
      }
    }
  ],

  // Careful! Must be true
  'open': true
}

// TODO Insert dialogs here

export default dialogs

/** Default alert dialog */
export function jsonDialogDefaultAlert(content: any) {
  return {
    'state': {
      'dialog': {
        '_type': 'alert',
        '_id': 'dev-drop-testing-database',
        'title': 'Server Response',
        'props': { 'fullWidth': true },
        'titleProps': {
          'sx': { 'textAlign': 'center' }
        },
        'content': JSON.stringify(content, null, 2),
        'actions': [
          {
            'type': 'json_button',
            'props': { 'color': 'secondary' },
            'has': {
              'text': 'Close',
              'handle': 'tuberCallbacks.defaultClose'
            }
          }
        ],
        'open': true // Dialog will open immediately
      }
    }
  }
}
