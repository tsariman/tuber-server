import { backgroundJson } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
// import { dialogDefaultCloseButtonJson } from '../button'

/**
 * __Note:__ The name of the dialog will be the key of the dialog in
 *       `IStateAllDialogs`
 */
export const annotationAddDialogJson: IStateDialog = {
  '_type': 'form',
  '_id': 'pro-insert-new-annotation',
  '_key': 'annotationAddDialog',
  'title': 'Insert New Annotation',
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
  'content': '$form : newAnnotation : annotations',
  'actions': [
    {
      'type': 'json_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': 'Cancel',
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'json_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': 'Save',
        'onclickHandle': 'tuberCallbacks.annotationAddFormSubmitCallback'
      }
    }
  ],
  'open': true // Careful! Must be set to true
}

export const annotationAddFromUrlDialogJson: IStateDialog = {
  '_type': 'form',
  '_id': 'pro-insert-annotation-from-url',
  '_key': 'annotationAddFromUrlDialog',
  'title': 'Insert New Video Annotation',
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
  'content': '$form : newAnnotationFromUrl : annotations',
  'actions': [],
  'open': true // Careful! Must be set to true
}

export const annotationEditDialogJson: IStateDialog = {
  '_type': 'form',
  '_id': 'pro-change-existing-annotation',
  '_key': 'annotationEditDialog',
  'title': 'Edit Annotation',
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
  'content': '$form : newAnnotation : annotations',
  'actions': [
    {
      'type': 'json_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': 'Cancel',
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'json_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': 'Save',
        'onclickHandle': 'tuberCallbacks.annotationEditFormSubmitCallback'
      }
    }
  ],
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
export function defaultDialogAlertJson<T=any>(content: T) {
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
        'content': content, // JSON.stringify(content, null, 2),
        'actions': [
          {
            'type': 'json_button',
            'props': { 'color': 'secondary' },
            'has': {
              'text': 'Close',
              'onclickHandle': 'tuberCallbacks.defaultClose'
            }
          }
        ],
        'open': true // Dialog will open immediately
      } as IStateDialog
    }
  }
}

export function dialogAlertJson<T=any>(content: T): IStateDialog {
  return {
    '_type': 'alert',
    '_id': 'dev-drop-testing-database',
    'title': 'Server Response',
    'props': { 'fullWidth': true },
    'titleProps': {
      'sx': { 'textAlign': 'center' }
    },
    'content': content, // JSON.stringify(content, null, 2),
    'actions': [
      {
        'type': 'json_button',
        'props': { 'color': 'secondary' },
        'has': {
          'text': 'Close',
          'onclickHandle': 'tuberCallbacks.defaultClose'
        }
      }
    ],
    'open': true // Dialog will open immediately
  } as IStateDialog
}