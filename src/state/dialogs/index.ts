import { backgroundJson } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
// import { dialogDefaultCloseButtonJson } from '../button'

/**
 * __Note:__ The name of the dialog will be the key of the dialog in
 *       `IStateAllDialogs`
 */
export const noteAddDialogJson: IStateDialog = {
  '_type': 'form',
  '_id': 'pro-insert-new-note',
  '_name': 'noteAddDialog',
  'title': 'Insert New Note',
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': { 'backgroundColor': backgroundJson.color }
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
  'open': true // Careful! Must be set to true
}

export const loginDialogJson: IStateDialog = {
  '_type': 'form',
  '_name': 'loginDialog',
  'title': 'Enter Your Credentials',
  'props': {
    'fullWidth': true,
    'maxWidth': 'xs'
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': '$form : login : users',
  // 'actions': [ dialogDefaultCloseButtonJson ],
  'open': true // Careful! Must be set to true
}

/** Default alert dialog */
export function defaultDialogAlertJson(content: any) {
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
