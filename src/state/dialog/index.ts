import Config from '../../config'
import * as C from '../../constants'
import { remove_form_suffix, themed_by_key } from '../../business.logic'
import { TNetState, TStateAllDialogs, TStateDialog } from '../../common.types'
import newRumbleBookmarkDialogState, {
  $8DarkThemeMode
} from './new.rumble.dialog'
import editRumbleBookmarkDialogState, {
  $11DarkThemeMode
} from './edit.rumble.dialog'
import newVimeoBookmarkDialogState, {
  $14DarkThemeMode
} from './new.vimeo.dialog'
import newOdyseeBookmarkDialogState, {
  $16DarkThemeMode
} from './new.odysee.dialog'
import newDailyBookmarkDialogState, {
  $21DarkThemeMode
} from './new.daily.dialog'
import editDailyBookmarkDialogState, {
  $22DarkThemeMode
} from './edit.daily.dialog'
import editVimeoBookmarkDialogState, {
  $15DarkThemeMode
} from './edit.vimeo.dialog'
import editOdyseeBookmarkDialogState, {
  $23DarkThemeMode
} from './edit.odysee.dialog'
import newFacebookBookmarkDialogState, {
  $26DarkThemeMode
} from './new.facebook.dialog'
import editFacebookBookmarkDialogState, {
  $27DarkThemeMode
} from './edit.facebook.dialog'
import newUnknownBookmarkDialogState, {
  $30DarkThemeMode
} from './new.unknown.dialog'
import editUnknownBookmarkDialogState, {
  $31DarkThemeMode
} from './edit.unknown.dialog'
import newTwitchBookmarkDialogState, {
  $36DarkThemeMode
} from './new.twitch.dialog'
import editTwitchBookmarkDialogState, {
  $37DarkThemeMode
} from './edit.twitch.dialog'

Config.register('state', '6', C.$6_STATE_KEY)
/** Dialog to create a new YouTube video bookmark @id 6 */
export const newYoutubeBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '6',
  '_key': C.$6_STATE_KEY,
  'title': 'Insert New YouTube Bookmark',
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': { 'backgroundColor': C.THEME_LIGHT_BACKGROUND_COLOR }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix(C.$4_STATE_KEY)} : bookmarks`,
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

/**
 * Dark theme mode for form state to create a new YouTube video
 * bookmark.
 * @id 6
 */
export const $6DarkThemeMode: TStateDialog = {
  ...newYoutubeBookmarkDialogState,
  'props': {
    ...newYoutubeBookmarkDialogState.props,
    'PaperProps': {
      ...newYoutubeBookmarkDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': C.THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  }
}

Config.register('state', '2', C.$2_STATE_KEY)
/** Dialog that contains the form to insert the new video url. @id 2 */
export const newVideoUrlDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '2',
  '_key': C.$2_STATE_KEY,
  'title': 'Insert the URL of Video to be Bookmarked',
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': { 'backgroundColor': C.THEME_LIGHT_BACKGROUND_COLOR }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix(C.$1_STATE_KEY)} : bookmarks`,
  'actions': [],
  'open': true
}

/**
 * Dark theme mode for form state to create a new video url.
 * @id 2
 */
export const $2DarkThemeMode: TStateDialog = {
  ...newVideoUrlDialogState,
  'props': {
    ...newVideoUrlDialogState.props,
    'PaperProps': {
      ...newVideoUrlDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': C.THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  }
}

Config.register('state', '7', C.$7_STATE_KEY)
/** Dialog to edit an existing YouTube video bookmark @id 7 */
export const editYoutubeBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '7',
  '_key': C.$7_STATE_KEY,
  'title': 'Edit YouTube Bookmark',
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': { 'backgroundColor': C.THEME_LIGHT_BACKGROUND_COLOR }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `'$form : ${remove_form_suffix(C.$5_STATE_KEY)} : bookmarks'`,
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

/**
 * Dark theme mode for form state to edit an existing YouTube video
 * bookmark.
 * @id 7
 */
export const $7DarkThemeMode: TStateDialog = {
  ...editYoutubeBookmarkDialogState,
  'props': {
    ...editYoutubeBookmarkDialogState.props,
    'PaperProps': {
      ...editYoutubeBookmarkDialogState.props?.PaperProps,
      'sx': { 'backgroundColor': C.THEME_DARK_DIALOG_BACKGROUND_COLOR }
    }
  }
}

Config.register('state', '32', C.$32_STATE_KEY)
/** @id 32 */
export const loginDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '32',
  '_key': C.$32_STATE_KEY,
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

export const $32DarkThemeMode: TStateDialog = {
  ...loginDialogState,
}

Config.register('state', '33', C.$33_STATE_KEY)
/** @id 33 */
export const registerDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '33',
  '_key': C.$33_STATE_KEY,
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

export const $33DarkThemeMode: TStateDialog = {
  ...registerDialogState,
}

Config.register('state', '34', C.$34_STATE_KEY)
/** @id 34 */
export const deleteBookmarkDialogState: TStateDialog = {
  '_type': 'alert',
  '_id': '34',
  '_key': C.$34_STATE_KEY,
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

export const $34DarkThemeMode: TStateDialog = {
  ...deleteBookmarkDialogState,
}

Config.register('state', '35', C.$35_STATE_KEY)
/** @id 35 */
export const clientAlertDialogState: TStateDialog = {
  '_type': 'alert',
  '_id': '35',
  '_key': C.$35_STATE_KEY,
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

export const $35DarkThemeMode: TStateDialog = {
  ...clientAlertDialogState,
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

export const STATE_DIALOGS_THEME_DARK: TStateAllDialogs = {
  [C.$2_STATE_KEY]: $2DarkThemeMode,
  [C.$6_STATE_KEY]: $6DarkThemeMode,
  [C.$7_STATE_KEY]: $7DarkThemeMode,
  [C.$8_STATE_KEY]: $8DarkThemeMode,
  [C.$11_STATE_KEY]: $11DarkThemeMode,
  [C.$14_STATE_KEY]: $14DarkThemeMode,
  [C.$15_STATE_KEY]: $15DarkThemeMode,
  [C.$16_STATE_KEY]: $16DarkThemeMode,
  [C.$21_STATE_KEY]: $21DarkThemeMode,
  [C.$22_STATE_KEY]: $22DarkThemeMode,
  [C.$23_STATE_KEY]: $23DarkThemeMode,
  [C.$26_STATE_KEY]: $26DarkThemeMode,
  [C.$27_STATE_KEY]: $27DarkThemeMode,
  [C.$30_STATE_KEY]: $30DarkThemeMode,
  [C.$31_STATE_KEY]: $31DarkThemeMode,
  [C.$32_STATE_KEY]: $32DarkThemeMode,
  [C.$33_STATE_KEY]: $33DarkThemeMode,
  [C.$34_STATE_KEY]: $34DarkThemeMode,
  [C.$35_STATE_KEY]: $35DarkThemeMode,
  [C.$36_STATE_KEY]: $36DarkThemeMode,
  [C.$37_STATE_KEY]: $37DarkThemeMode
}

export const STATE_DIALOGS: { [key: string]: TStateDialog } = {
  [C.$2_STATE_KEY]: newVideoUrlDialogState,
  [C.$6_STATE_KEY]: newYoutubeBookmarkDialogState,
  [C.$7_STATE_KEY]: editYoutubeBookmarkDialogState,
  [C.$8_STATE_KEY]: newRumbleBookmarkDialogState,
  [C.$11_STATE_KEY]: editRumbleBookmarkDialogState,
  [C.$14_STATE_KEY]: newVimeoBookmarkDialogState,
  [C.$15_STATE_KEY]: editVimeoBookmarkDialogState,
  [C.$16_STATE_KEY]: newOdyseeBookmarkDialogState,
  [C.$21_STATE_KEY]: newDailyBookmarkDialogState,
  [C.$22_STATE_KEY]: editDailyBookmarkDialogState,
  [C.$23_STATE_KEY]: editOdyseeBookmarkDialogState,
  [C.$26_STATE_KEY]: newFacebookBookmarkDialogState,
  [C.$27_STATE_KEY]: editFacebookBookmarkDialogState,
  [C.$30_STATE_KEY]: newUnknownBookmarkDialogState,
  [C.$31_STATE_KEY]: editUnknownBookmarkDialogState,
  [C.$32_STATE_KEY]: loginDialogState,
  [C.$33_STATE_KEY]: registerDialogState,
  [C.$34_STATE_KEY]: deleteBookmarkDialogState,
  [C.$35_STATE_KEY]: clientAlertDialogState,
  [C.$36_STATE_KEY]: newTwitchBookmarkDialogState,
  [C.$37_STATE_KEY]: editTwitchBookmarkDialogState,
}

export default function get_dialog_state(key: string): TStateDialog | undefined {
  return themed_by_key(key, STATE_DIALOGS, STATE_DIALOGS_THEME_DARK)
}