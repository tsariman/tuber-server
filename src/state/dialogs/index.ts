import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { NEW_VIDEO_URL_FORM_UNSUFFIXED_NAME } from '../forms/new.video.url.form.state'
import {
  NEW_YOUTUBE_ANNNOTATION_UNSUFFIXED_NAME
} from '../forms/new.youtube.annotation.form.state'
import {
  EDIT_YOUTUBE_ANNOTATION_UNSUFFIXED_NAME
} from '../forms/edit.youtube.annotation.form.state'

const _6 = '6'
const _6_KEY = 'newYouTubeAnnotationDialog'
Config.register('state', _6, _6_KEY)
/** Dialog to create a new YouTube video annotation @id 6 */
export const newYoutubeAnnotationDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _6,
  '_key': _6_KEY,
  'title': 'Insert New YouTube Annotation',
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': { 'backgroundColor': backgroundState.color }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${NEW_YOUTUBE_ANNNOTATION_UNSUFFIXED_NAME} : annotations`,
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
        'onclickHandle': 'tuberCallbacks._6_C_1'
      }
    }
  ],
  'open': true // Careful! Must be set to true
}

const _2 = '2'
const _2_KEY = 'newVideoUrlDialog'
Config.register('state', _2, _2_KEY)
/** Dialog that contains the form to insert the new video url. @id 2 */
export const newVideoUrlDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _2,
  '_key': _2_KEY,
  'title': 'Insert the URL of Video to be Annotated',
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': { 'backgroundColor': backgroundState.color }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${NEW_VIDEO_URL_FORM_UNSUFFIXED_NAME} : annotations`,
  'actions': [],
  'open': true // Careful! Must be set to true
}

const _7 = '7'
const _7_KEY = 'editYouTubeAnnotationDialog'
Config.register('state', _7, _7_KEY)
/** Dialog to edit an existing YouTube video annotation @id 7 */
export const editYoutubeAnnotationDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _7,
  '_key': _7_KEY,
  'title': 'Edit Annotation',
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': { 'backgroundColor': backgroundState.color }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `'$form : ${EDIT_YOUTUBE_ANNOTATION_UNSUFFIXED_NAME} : annotations'`,
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
        'onclickHandle': 'tuberCallbacks._7_C_1'
      }
    }
  ],
  'open': true // Careful! Must be set to true
}

export const loginDialogState: IStateDialog = {
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

export const registerDialogState: IStateDialog = {
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

export const deleteAnnotationDialogState: IStateDialog = {
  '_type': 'alert',
  '_key': 'annotationDeleteDialog',
  '_id': 'pro-delete-existing-annotation',
  'title': 'Delete Annotation',
  'props': { 'fullWidth': true },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': 'Are you sure you want to delete this annotation?',
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
        'text': 'Delete',
        'onclickHandle': 'tuberCallbacks.annotationDeleteCallback'
      }
    }
  ],
  'open': true // Careful! Must be set to true
}

/** Default alert dialog */
export function defaultDialogAlertState<T=any>(content: T) {
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

export function dialogAlertState<T=any>(content: T): IStateDialog {
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