import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { NEW_VIDEO_URL_FORM_UNSUFFIXED_NAME } from '../form/new.video.url.form.state'
import {
  NEW_YOUTUBE_BOOKMARK_UNSUFFIXED_NAME
} from '../form/new.youtube.bookmark.form.state'
import {
  EDIT_YOUTUBE_BOOKMARK_UNSUFFIXED_NAME
} from '../form/edit.youtube.bookmark.form.state'

const $6 = '6'
const $6_KEY = 'newYouTubeBookmarkDialog'
Config.register('state', $6, $6_KEY)
/** Dialog to create a new YouTube video bookmark @id 6 */
export const newYoutubeBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': $6,
  '_key': $6_KEY,
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
        'onclickHandle': 'tuberCallbacks.$6_C_1'
      }
    }
  ],
  'open': true
}

const $2 = '2'
const $2_KEY = 'newVideoUrlDialog'
Config.register('state', $2, $2_KEY)
/** Dialog that contains the form to insert the new video url. @id 2 */
export const newVideoUrlDialogState: IStateDialog = {
  '_type': 'form',
  '_id': $2,
  '_key': $2_KEY,
  'title': 'Insert the URL of Video to be Bookmarked',
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

const $7 = '7'
const $7_KEY = 'editYouTubeBookmarkDialog'
Config.register('state', $7, $7_KEY)
/** Dialog to edit an existing YouTube video bookmark @id 7 */
export const editYoutubeBookmarkDialogState: IStateDialog = {
  '_type': 'form',
  '_id': $7,
  '_key': $7_KEY,
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
        'onclickHandle': 'tuberCallbacks.$7_C_1'
      }
    }
  ],
  'open': true
}

const $32 = '32'
const $32_KEY = 'loginDialog'
Config.register('state', $32, $32_KEY)
/** @id 32 */
export const loginDialogState: IStateDialog = {
  '_type': 'form',
  '_id': $32,
  '_key': $32_KEY,
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

const $33 = '33'
const $33_KEY = 'registerDialog'
Config.register('state', $33, $33_KEY)
/** @id 33 */
export const registerDialogState: IStateDialog = {
  '_type': 'form',
  '_id': $33,
  '_key': $33_KEY,
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

const $34 = '34'
const $34_KEY = 'bookmarkDeleteDialog'
Config.register('state', $34, $34_KEY)
/** @id 34 */
export const deleteBookmarkDialogState: IStateDialog = {
  '_type': 'alert',
  '_id': $34,
  '_key': $34_KEY,
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

const $35 = '35'
const $35_KEY = 'clientAlertDialog'
Config.register('state', $35, $35_KEY)
/** @id 35 */
export const clientAlertDialogState: IStateDialog = {
  '_type': 'alert',
  '_id': $35,
  '_key': $35_KEY,
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
