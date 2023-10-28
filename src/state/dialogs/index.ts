import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { NEW_VIDEO_URL_FORM_UNSUFFIXED_NAME } from '../forms/new.video.url.form.state'
import {
  NEW_YOUTUBE_BOOKMARK_UNSUFFIXED_NAME
} from '../forms/new.youtube.bookmark.form.state'
import {
  EDIT_YOUTUBE_BOOKMARK_UNSUFFIXED_NAME
} from '../forms/edit.youtube.bookmark.form.state'

const _6 = '6'
const _6_KEY = 'newYouTubeBookmarkDialog'
Config.register('state', _6, _6_KEY)
/** Dialog to create a new YouTube video bookmark @id 6 */
export const newYoutubeBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _6,
  '_key': _6_KEY,
  'title': 'Insert New YouTube Bookmark',
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
  'content': `$form : ${NEW_YOUTUBE_BOOKMARK_UNSUFFIXED_NAME} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': 'Cancel',
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': 'Save',
        'onclickHandle': 'tuberCallbacks._6_C_1'
      }
    }
  ],
  'open': true
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
  'content': `$form : ${NEW_VIDEO_URL_FORM_UNSUFFIXED_NAME} : bookmarks`,
  'actions': [],
  'open': true
}

const _7 = '7'
const _7_KEY = 'editYouTubeBookmarkDialog'
Config.register('state', _7, _7_KEY)
/** Dialog to edit an existing YouTube video bookmark @id 7 */
export const editYoutubeBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _7,
  '_key': _7_KEY,
  'title': 'Edit YouTube Bookmark',
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
  'content': `'$form : ${EDIT_YOUTUBE_BOOKMARK_UNSUFFIXED_NAME} : bookmarks'`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': 'Cancel',
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': 'Save',
        'onclickHandle': 'tuberCallbacks._7_C_1'
      }
    }
  ],
  'open': true
}

const _32 = '32'
const _32_KEY = 'loginDialog'
Config.register('state', _32, _32_KEY)
export const loginDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _32,
  '_key': _32_KEY,
  'title': 'Enter Your Credentials',
  'props': {
    'fullWidth': true,
    'maxWidth': 'xs'
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': '$form : login : authentification',
  'open': true
}

const _33 = '33'
const _33_KEY = 'registerDialog'
Config.register('state', _33, _33_KEY)
export const registerDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _33,
  '_key': _33_KEY,
  'title': 'Register New User',
  'props': {
    'fullWidth': true,
    'maxWidth': 'xs'
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': '$form : register : users',
  'open': true
}

const _34 = '34'
const _34_KEY = 'bookmarkDeleteDialog'
Config.register('state', _34, _34_KEY)
export const deleteBookmarkDialogState: IStateDialog = {
  '_type': 'alert',
  '_id': _34,
  '_key': _34_KEY,
  'title': 'Delete Bookmark',
  'props': { 'fullWidth': true },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': 'Are you sure you want to delete this bookmark?',
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': 'Cancel',
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': 'Delete',
        'onclickHandle': 'tuberCallbacks.bookmarkDeleteCallback'
      }
    }
  ],
  'open': true // Careful! Must be set to true
}

const _35 = '35'
const _35_KEY = 'clientAlertDialog'
Config.register('state', _35, _35_KEY)
export const clientAlertDialogState: IStateDialog = {
  '_type': 'alert',
  '_id': _35,
  '_key': _35_KEY,
  'title': 'Feedback',
  'props': { 'fullWidth': true },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': '',
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': 'Cancel',
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    }
  ]
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
        'content': content,
        'actions': [
          {
            'type': 'state_button',
            'props': { 'color': 'secondary' },
            'has': {
              'text': 'Close',
              'onclickHandle': 'tuberCallbacks.defaultClose'
            }
          }
        ],
        'open': true
      } as IStateDialog
    }
  }
}

export const alert = defaultDialogAlertState

export function dialogAlertState<T=any>(content: T): IStateDialog {
  return {
    '_type': 'alert',
    '_id': 'dev-drop-testing-database',
    'title': 'Server Response',
    'props': { 'fullWidth': true },
    'titleProps': {
      'sx': { 'textAlign': 'center' }
    },
    'content': content,
    'actions': [
      {
        'type': 'state_button',
        'props': { 'color': 'secondary' },
        'has': {
          'text': 'Close',
          'onclickHandle': 'tuberCallbacks.defaultClose'
        }
      }
    ],
    'open': true
  } as IStateDialog
}
