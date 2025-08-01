import * as C from '../../constants';
import {
  get_state_key as key,
  r,
  remove_form_suffix,
  set_state_by_key,
  themed,
  themed_by_key
} from '../../business.logic';
import {
  TNetState,
  TStateAllDialogs,
  TStateDialog,
  TThemeMode
} from '../../common.types';
import newRumbleBookmarkDialogState, {
  $8DarkThemeMode
} from './new.rumble.dialog';
import editRumbleBookmarkDialogState, {
  $11DarkThemeMode
} from './edit.rumble.dialog';
import newVimeoBookmarkDialogState, {
  $14DarkThemeMode
} from './new.vimeo.dialog';
import newOdyseeBookmarkDialogState, {
  $16DarkThemeMode
} from './new.odysee.dialog';
import newDailyBookmarkDialogState, {
  $21DarkThemeMode
} from './new.daily.dialog';
import editDailyBookmarkDialogState, {
  $22DarkThemeMode
} from './edit.daily.dialog';
import editVimeoBookmarkDialogState, {
  $15DarkThemeMode
} from './edit.vimeo.dialog';
import editOdyseeBookmarkDialogState, {
  $23DarkThemeMode
} from './edit.odysee.dialog';
import newFacebookBookmarkDialogState, {
  $26DarkThemeMode
} from './new.facebook.dialog';
import editFacebookBookmarkDialogState, {
  $27DarkThemeMode
} from './edit.facebook.dialog';
import newUnknownBookmarkDialogState, {
  $30DarkThemeMode
} from './new.unknown.dialog';
import editUnknownBookmarkDialogState, {
  $31DarkThemeMode
} from './edit.unknown.dialog';
import newTwitchBookmarkDialogState, {
  $36DarkThemeMode
} from './new.twitch.dialog';
import editTwitchBookmarkDialogState, {
  $37DarkThemeMode
} from './edit.twitch.dialog';
import { register } from '../../business.logic/registry';

register('state', '6', C.$6_STATE_KEY);
/** Dialog to create a new YouTube video bookmark @id 6 */
export const newYoutubeBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '6',
  '_key': C.$6_STATE_KEY,
  'title': r('30', 'Insert New YouTube Bookmark'),
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
        'text': r('31', 'Cancel'),
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': r('32', 'Save'),
        'onclickHandle': 'tuberCallbacks.$6_C_1'
      }
    }
  ],
  'open': true
};

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
};

register('state', '2', C.$2_STATE_KEY);
/** Dialog that contains the form to insert the new video url. @id 2 */
export const newVideoUrlDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '2',
  '_key': C.$2_STATE_KEY,
  'title': r('33', 'Insert the URL of Video to be Bookmarked'),
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
};

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
};

register('state', '7', C.$7_STATE_KEY);
/** Dialog to edit an existing YouTube video bookmark @id 7 */
export const editYoutubeBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '7',
  '_key': C.$7_STATE_KEY,
  'title': r('34', 'Edit YouTube Bookmark'),
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
  'content': `$form : ${remove_form_suffix(C.$5_STATE_KEY)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': r('35', 'Cancel'),
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': r('36', 'Save'),
        'onclickHandle': 'tuberCallbacks.$7_C_1'
      }
    }
  ],
  'open': true
};

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
};

register('state', '32', C.$32_STATE_KEY);
/** Sign in dialog state. @id 32 */
export const signInDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '32',
  '_key': C.$32_STATE_KEY,
  'title': r('37', 'Enter Your Credentials'),
  'props': {
    'fullWidth': true,
    'maxWidth': 'xs'
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix(C.$41_STATE_KEY)} : ${C.EP_AUTHENTICATE}`,
  'open': true
};

/** Dark theme mode for sign in dialog state. @id 32 */
export const $32DarkThemeMode: TStateDialog = {
  ...signInDialogState,
};

register('state', '33', C.$33_STATE_KEY);
/** Dialog state for registering a new user @id 33 */
export const registerDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '33',
  '_key': C.$33_STATE_KEY,
  'title': r('38', 'Register New User'),
  'props': {
    'fullWidth': true,
    'maxWidth': 'xs'
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix(C.$69_STATE_KEY)} : ${C.EP_USERS}`,
  'open': true
};

/** Dark theme mode dialog state for registering a new user @id 33 */
export const $33DarkThemeMode: TStateDialog = {
  ...registerDialogState,
  // TODO Implement the dark theme color values here.
};

register('state', '34', C.$34_STATE_KEY);
/** Dialog state to delete a bookmark. @id 34 */
export const deleteBookmarkDialogState: TStateDialog = {
  '_type': 'alert',
  '_id': '34',
  '_key': C.$34_STATE_KEY,
  'title': r('39', 'Delete Bookmark'),
  'props': { 'fullWidth': true },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': r('40', 'Are you sure you want to delete this bookmark?'),
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': r('41', 'Cancel'),
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': r('42', 'Delete'),
        'onclickHandle': 'tuberCallbacks.$34_C_1'
      }
    }
  ],
  'open': true // Careful! Must be set to true
};

/** Dark theme mode dialog state to delete a bookmark. @id 34  */
export const $34DarkThemeMode: TStateDialog = {
  ...deleteBookmarkDialogState,
};

register('state', '35', C.$35_STATE_KEY);
/** Client alert dialog. @id 35 */
export const clientAlertDialogState: TStateDialog = {
  '_type': 'alert',
  '_id': '35',
  '_key': C.$35_STATE_KEY,
  'title': r('43', 'Feedback'),
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
        'text': r('44', 'Cancel'),
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    }
  ]
};

/** Dark theme mode for client alert dialog. @id 35 */
export const $35DarkThemeMode: TStateDialog = {
  ...clientAlertDialogState,
};

register('state', '68', C.$68_STATE_KEY);
/** Dialog state to confirm logging out. @id 68 */
export const confirmSignOutDialogState: TStateDialog = {
  '_type': 'alert',
  '_id': '68',
  '_key': C.$68_STATE_KEY,
  'title': 'Logout',
  'props': { 'fullWidth': true },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': r('45', 'Are you sure you want to logout?'),
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': r('46', 'Cancel'),
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': r('47', 'Logout'),
        'onclickHandle': 'tuberCallbacks.$68_C_1'
      }
    }
  ],
  'open': true
};

/** Dark theme mode for dialog state to confirm logging out. @id 68 */
export const $68DarkThemeMode: TStateDialog = {
  ...confirmSignOutDialogState,
};

/**
 * Default alert dialog.  
 * Use it as the response to show a dialog containing a message or
 * anything else client side.
 * @id 64
 */
export function defaultDialogAlertState<T=unknown>(content: T) {
  return {
    'state': {
      'dialog': {
        '_type': 'alert',
        '_id': '64',
        '_key': C.$64_STATE_KEY,
        'title': r('48', 'Server Response'),
        'props': { 'fullWidth': true },
        'titleProps': {
          'sx': { 'textAlign': 'center' }
        },
        content,
        'actions': [
          {
            'type': 'state_button',
            'props': { 'color': 'secondary' },
            'has': {
              'text': r('49', 'Close'),
              'onclickHandle': 'tuberCallbacks.defaultClose'
            }
          }
        ],
        'open': true
      }
    } as TNetState
  };
}

export const alert = defaultDialogAlertState;

/**
 * Simple dialog alert. It must be inserted at `state.dialog` e.g.
 * ```ts
 * reply.send({
 *  'state': {
 *   'dialog': dialogAlertState('Hello World')
 *  }
 * })
 * ```
 * @id 65
 */
export function dialogAlertState<T=unknown>(content: T): TStateDialog {
  return {
    '_type': 'alert',
    '_id': '65',
    '_key': C.$65_STATE_KEY,
    'title': r('50', 'Server Response'),
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
          'text': r('51', 'Close'),
          'onclickHandle': 'tuberCallbacks.defaultClose'
        }
      }
    ],
    'open': true
  } as TStateDialog;
}

/**
 * Bootstrap state for dialogs light theme mode.
 * @returns object of all dialogs in light theme mode.
 *
 * @deprecated
 */
export function bootstrap_dialogs_light_state() {
  const dialogs: TStateAllDialogs = {};
  set_state_by_key(dialogs, signInDialogState);
  set_state_by_key(dialogs, confirmSignOutDialogState);
  // TODO: Don't forget to insert light mode state for each dialog

  return dialogs;
}

/**
 * Bootstrap state for dialogs dark theme mode.
 * @returns object of all dialogs in dark theme mode.
 *
 * @deprecated
 */
export function bootstrap_dialogs_dark_state() {
  const dialogs: TStateAllDialogs = {};
  set_state_by_key(dialogs, $32DarkThemeMode);
  set_state_by_key(dialogs, $68DarkThemeMode);
  // TODO: Don't forget to insert dark mode state for each dialog

  return dialogs;
}

/**
 * Get the dialog state to sign in.
 *
 * @param list of all dialogs
 * @param mode theme mode
 * @returns void
 */
function _get_signin_dialog_state(mode?: TThemeMode) {
  return themed(
    signInDialogState,
    $32DarkThemeMode,
    mode
  );
}

/**
 * Sign out dialog state.
 *
 * @param list of all dialogs
 * @param mode theme mode
 * @returns void
 */
function _get_signout_dialog_state (mode?: TThemeMode) {
  return themed(
    confirmSignOutDialogState,
    $68DarkThemeMode,
    mode
  );
}

/**
 * Bootstrap state for dialogs.
 *
 * @param mode 
 * @returns object of all dialogs.
 *
 * @deprecated
 */
export function bootstrap_dialogs_state(mode?: TThemeMode) {
  const dialogs: TStateAllDialogs = {};
  dialogs[key(signInDialogState)] = _get_signin_dialog_state(mode);
  dialogs[key(confirmSignOutDialogState)] = _get_signout_dialog_state(mode);

  // TODO Insert your new dialog here if you want it to be load in the
  //      bootstrapping process.

  return dialogs;
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
  [C.$37_STATE_KEY]: $37DarkThemeMode,
  [C.$68_STATE_KEY]: $68DarkThemeMode,
};

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
  [C.$32_STATE_KEY]: signInDialogState,
  [C.$33_STATE_KEY]: registerDialogState,
  [C.$34_STATE_KEY]: deleteBookmarkDialogState,
  [C.$35_STATE_KEY]: clientAlertDialogState,
  [C.$36_STATE_KEY]: newTwitchBookmarkDialogState,
  [C.$37_STATE_KEY]: editTwitchBookmarkDialogState,
  [C.$68_STATE_KEY]: confirmSignOutDialogState,
};

export default function get_dialog_state(key: string): TStateDialog | undefined {
  return themed_by_key(key, STATE_DIALOGS, STATE_DIALOGS_THEME_DARK);
}