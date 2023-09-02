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
  '_key': 'noteAddDialog',
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
  'content': '$form : newNote : notes',
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

export const videoNoteAddDialogJson: IStateDialog = {
  '_type': 'form',
  '_id': 'pro-insert-new-video-note',
  '_key': 'videoNoteAddDialog',
  'title': 'Insert New Video Note',
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
  'content': '$form : newVideoNote : notes',
  'actions': [],
  'open': true // Careful! Must be set to true
}

export const loginDialogJson: IStateDialog = {
  '_type': 'form',
  '_key': 'loginDialog',
  'title': 'Enter Your Credentials',
  'props': {
    'fullWidth': true,
    'maxWidth': 'xs'
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': '$form : login : authentification',
  // 'actions': [ dialogDefaultCloseButtonJson ],
  'open': true // Careful! Must be set to true
}

export const registerDialogJson: IStateDialog = {
  '_type': 'form',
  '_key': 'registerDialog',
  'title': 'Register New User',
  'props': {
    'fullWidth': true,
    'maxWidth': 'xs'
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': '$form : register : users',
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
