import Config from '../../config'
import { backgroundState } from '..'
import * as C from '../../constants'
import { remove_form_suffix } from '../form/_forms.business.logic'
import { TNetState, TStateDialog } from '../../common.types'

Config.register('state', '6', C.$6_KEY)
/** Dialog to create a new YouTube video bookmark @id 6 */
export const newYoutubeBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '6',
  '_key': C.$6_KEY,
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
  'content': `$form : ${remove_form_suffix(C.$4_KEY)} : bookmarks`,
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

Config.register('state', '2', C.$2_KEY)
/** Dialog that contains the form to insert the new video url. @id 2 */
export const newVideoUrlDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '2',
  '_key': C.$2_KEY,
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
  'content': `$form : ${remove_form_suffix(C.$1_KEY)} : bookmarks`,
  'actions': [],
  'open': true
}

Config.register('state', '7', C.$7_KEY)
/** Dialog to edit an existing YouTube video bookmark @id 7 */
export const editYoutubeBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '7',
  '_key': C.$7_KEY,
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
  'content': `'$form : ${remove_form_suffix(C.$5_KEY)} : bookmarks'`,
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

Config.register('state', '32', C.$32_KEY)
/** @id 32 */
export const loginDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '32',
  '_key': C.$32_KEY,
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

Config.register('state', '33', C.$33_KEY)
/** @id 33 */
export const registerDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '33',
  '_key': C.$33_KEY,
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

Config.register('state', '34', C.$34_KEY)
/** @id 34 */
export const deleteBookmarkDialogState: TStateDialog = {
  '_type': 'alert',
  '_id': '34',
  '_key': C.$34_KEY,
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

Config.register('state', '35', C.$35_KEY)
/** @id 35 */
export const clientAlertDialogState: TStateDialog = {
  '_type': 'alert',
  '_id': '35',
  '_key': C.$35_KEY,
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
      }
    } as TNetState
  }
}

export const alert = defaultDialogAlertState

export function dialogAlertState<T=any>(content: T): TStateDialog {
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
  } as TStateDialog
}
