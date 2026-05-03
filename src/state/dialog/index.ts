import {
  type TStateDialog,
  type TJsonapiStateResponse,
  type TNetState,
  type TStateAllDialogs,
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  THEME_LIGHT_BACKGROUND_COLOR,
  EP_AUTH,
  EP_USERS
} from '@tuber/shared'
import {
  get_state_key as key,
  t,
  remove_form_suffix,
  set_state_by_key,
  themed,
  themed_by_key,
  clone_with_descriptors,
  clone_or_default
} from '../../business.logic'
import { TThemeMode } from '../../common.types'
import newRumbleBookmarkDialogState, {
  $8DarkThemeMode
} from './new.rumble.dialog.state'
import editRumbleBookmarkDialogState, {
  $11DarkThemeMode
} from './edit.rumble.dialog.state'
import newVimeoBookmarkDialogState, {
  $14DarkThemeMode
} from './new.vimeo.dialog.state'
import newOdyseeBookmarkDialogState, {
  $16DarkThemeMode
} from './new.odysee.dialog.state'
import newDailyBookmarkDialogState, {
  $21DarkThemeMode
} from './new.daily.dialog.state'
import editDailyBookmarkDialogState, {
  $22DarkThemeMode
} from './edit.daily.dialog.state'
import editVimeoBookmarkDialogState, {
  $15DarkThemeMode
} from './edit.vimeo.dialog.state'
import editOdyseeBookmarkDialogState, {
  $23DarkThemeMode
} from './edit.odysee.dialog.state'
import newFacebookBookmarkDialogState, {
  $26DarkThemeMode
} from './new.facebook.dialog.state'
import editFacebookBookmarkDialogState, {
  $27DarkThemeMode
} from './edit.facebook.dialog.state'
import newUnknownBookmarkDialogState, {
  $30DarkThemeMode
} from './new.unknown.dialog.state'
import editUnknownBookmarkDialogState, {
  $31DarkThemeMode,
  EditUnknownBookmarkDialogState
} from './edit.unknown.dialog.state'
import newTwitchBookmarkDialogState, {
  $36DarkThemeMode
} from './new.twitch.dialog.state'
import editTwitchBookmarkDialogState, {
  $37DarkThemeMode
} from './edit.twitch.dialog.state'
import passwordRecoveryDialogState, {
  $85DarkThemeMode
} from './password.recovery.dialog.state'
import passwordRecoveryCodeDialogState, {
  $94DarkThemeMode
} from './password.recovery.code.dialog.state'
import passwordResetDialogState, {
  $95DarkThemeMode
} from './password.reset.dialog.state'
import feedbackDialogState, {
  $87DarkThemeMode
} from './feedback.dialog.state'
import { register } from '../../business.logic/registry'
import { THEME_LIGHT_PAPER_SX_PROPS } from '../theme.state'
import { TContextualUser } from '../../schema/user'
import STATE_KEY from '../../business.logic/state.key'

const $1 = STATE_KEY['1']
const $2 = STATE_KEY['2']
const $4 = STATE_KEY['4']
const $5 = STATE_KEY['5']
const $6 = STATE_KEY['6']
const $7 = STATE_KEY['7']
const $8 = STATE_KEY['8']
const $11 = STATE_KEY['11']
const $14 = STATE_KEY['14']
const $15 = STATE_KEY['15']
const $16 = STATE_KEY['16']
const $21 = STATE_KEY['21']
const $22 = STATE_KEY['22']
const $23 = STATE_KEY['23']
const $26 = STATE_KEY['26']
const $27 = STATE_KEY['27']
const $30 = STATE_KEY['30']
const $31 = STATE_KEY['31']
const $32 = STATE_KEY['32']
const $33 = STATE_KEY['33']
const $34 = STATE_KEY['34']
const $35 = STATE_KEY['35']
const $36 = STATE_KEY['36']
const $37 = STATE_KEY['37']
const $41 = STATE_KEY['41']
const $64 = STATE_KEY['64']
const $65 = STATE_KEY['65']
const $68 = STATE_KEY['68']
const $69 = STATE_KEY['69']
const $85 = STATE_KEY['85']
const $87 = STATE_KEY['87']
const $94 = STATE_KEY['94']
const $95 = STATE_KEY['95']
const $92 = STATE_KEY['92']
const VISITOR_PATREON_URL = 'https://www.patreon.com/c/bookmarktube/membership'

register('state', '6', $6)
/** Dialog to create a new YouTube video bookmark @id 6 */
export const newYoutubeBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '6',
  '_key': $6,
  get 'title'() { return t('30', 'Insert New YouTube Bookmark') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': { 'sx': { ...THEME_LIGHT_PAPER_SX_PROPS } },
    'sx': { 'overflowX': 'hidden' }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($4)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('31', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('32', 'Save') },
        'onclickHandler': 'tuberCallbacks.$6_C_1'
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
export const $6DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(newYoutubeBookmarkDialogState)
  const props = clone_or_default(base.props, {})
  const paperProps = clone_or_default(props, {})
  paperProps.sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  }
  props.PaperProps = paperProps
  base.props = props
  return base
})()

register('state', '2', $2)
/** Dialog that contains the form to insert the new video url. @id 2 */
export const newVideoUrlDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '2',
  '_key': $2,
  get 'title'() { return t('33', 'Insert the URL of Video to be Bookmarked') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': { 'backgroundColor': THEME_LIGHT_BACKGROUND_COLOR }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($1)} : bookmarks`,
  'open': true
}

/**
 * Dark theme mode for form state to create a new video url.
 * @id 2
 */
export const $2DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(newVideoUrlDialogState)
  const props = clone_or_default(base.props, {})
  const paperProps = clone_or_default(props.PaperProps, {})
  paperProps.sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  }
  props.PaperProps = paperProps
  base.props = props
  return base
})()

register('state', '7', $7)
/** Dialog to edit an existing YouTube video bookmark @id 7 */
export const editYoutubeBookmarkDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '7',
  '_key': $7,
  get 'title'() { return t('34', 'Edit YouTube Bookmark') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': {
        ...THEME_LIGHT_PAPER_SX_PROPS,
        'overflowX': 'hidden !important'
      }
    },
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($5)} : bookmarks`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('35', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('36', 'Save') },
        'onclickHandler': 'tuberCallbacks.$7_C_1'
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
export const $7DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(editYoutubeBookmarkDialogState)
  const props = clone_or_default(base.props, {})
  const paperProps = clone_or_default(props.PaperProps, {})
  paperProps.sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  }
  props.PaperProps = paperProps
  base.props = props
  return base
})()

register('state', '32', $32)
/** Sign in dialog state. @id 32 */
export const signInDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '32',
  '_key': $32,
  get 'title'() { return t('37', 'Enter Your Credentials') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'xs'
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($41)} : ${EP_AUTH.IN}`,
  'open': true
}

/** Dark theme mode for sign in dialog state. @id 32 */
export const $32DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(signInDialogState)
  return base
})()

register('state', '33', $33)
/** Dialog state for registering a new user @id 33 */
export const registerDialogState: TStateDialog = {
  '_type': 'form',
  '_id': '33',
  '_key': $33,
  get 'title'() { return t('38', 'Register New User') },
  'props': {
    'fullWidth': true,
    'maxWidth': 'xs'
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${remove_form_suffix($69)} : ${EP_USERS}`,
  'open': true
}

/** Dark theme mode dialog state for registering a new user @id 33 */
export const $33DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(registerDialogState)
  return base
})()

register('state', '34', $34)
/** Dialog state to delete a bookmark. @id 34 */
export const deleteBookmarkDialogState: TStateDialog = {
  '_type': 'alert',
  '_id': '34',
  '_key': $34,
  get 'title'() { return t('39', 'Delete Bookmark') },
  'props': { 'fullWidth': true },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  get 'content'() { return t('40', 'Are you sure you want to delete this bookmark?') },
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('41', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('42', 'Delete') },
        'onclickHandler': 'tuberCallbacks.$34_C_1'
      }
    }
  ],
  'open': true // Careful! Must be set to true
}

/** Dark theme mode dialog state to delete a bookmark. @id 34  */
export const $34DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(deleteBookmarkDialogState)
  return base
})()

register('state', '35', $35)
/** Client alert dialog. @id 35 */
export const clientAlertDialogState: TStateDialog = {
  '_type': 'alert',
  '_id': '35',
  '_key': $35,
  get 'title'() { return t('43', 'Feedback') },
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
        get 'text'() { return t('44', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    }
  ]
}

/** Dark theme mode for client alert dialog. @id 35 */
export const $35DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(clientAlertDialogState)
  return base
})()

register('state', '68', $68)
/** Dialog state to confirm logging out. @id 68 */
export const confirmSignOutDialogState: TStateDialog = {
  '_type': 'alert',
  '_id': '68',
  '_key': $68,
  'title': 'Logout',
  'props': { 'fullWidth': true },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  get 'content'() { return t('45', 'Are you sure you want to sign out?') },
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('46', 'Cancel') },
        'onclickHandler': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        get 'text'() { return t('47', 'Logout') },
        'onclickHandler': 'tuberCallbacks.$68_C_1'
      }
    }
  ],
  'open': true
}

/** Dark theme mode for dialog state to confirm logging out. @id 68 */
export const $68DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(confirmSignOutDialogState)
  return base
})()

/**
 * Use as the response to show a dialog containing a message or anything else 
 * client side.
 * @id 64
 */
export function alertResponse<T=unknown>(content: T): TJsonapiStateResponse {
  return {
    'state': {
      'dialog': {
        '_type': 'alert',
        '_id': '64',
        '_key': $64,
        get 'title'() { return t('48', 'Server Response') },
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
              get 'text'() { return t('49', 'Close') },
              'onclickHandler': 'tuberCallbacks.defaultClose'
            }
          }
        ],
        'open': true
      }
    }
  }
}

/**
 * Use as a dialog portion of a state to show a dialog client side
 * @param content
 * @id 65
 */
export function alertDialogState<T=unknown>(content: T): TStateDialog {
  return {
    '_type': 'alert',
    '_id': '65',
    '_key': $65,
    get 'title'() { return t('50', 'Server Response') },
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
          get 'text'() { return t('51', 'Close') },
          'onclickHandler': 'tuberCallbacks.defaultClose'
        }
      }
    ],
    'open': true
  }
}

export const visitorAlertDialogState: TStateDialog = {
  '_type': 'alert',
  '_id': '92',
  '_key': $92,
  get 'title'() { return t('welcome_visitor', 'About This Website') },
  'props': { 'fullWidth': true },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  get 'content'() {
    return t(
      'visitor_alert_dialog_content',
      `<div>
      <p>
      It allows you to <em>bookmark</em> a specific moment in an <span style="text-decoration:underline;">online video</span> and return to it later. 
      It's like a search engine for moments in videos but people decide what's listed not algorithms.
      </p>
      <p>
      This feature is currently experimental. You can help by creating an account
      and saving bookmarks. Support me on Patreon to make your bookmarks public.
      </p>
      <p style="text-align:center;">
      <a
      href="${VISITOR_PATREON_URL}"
      target="_blank"
      rel="noopener noreferrer"
      style="display:inline-block;padding:0.625rem 1rem;border-radius:0.5rem;background:#ff424d;color:#fff;text-decoration:none;font-weight:600;"
      >Open Patreon</a>
      </p>
      <p style="text-align:center;">
      Contact me at:<br />
      <span style="display:inline-flex;gap:0.5rem;flex-wrap:wrap;justify-content:center;margin-top:0.5rem;">
      <span style="display:inline-block;padding:0.625rem 1rem;border-radius:0.5rem;background:#0073e6;color:#fff;text-decoration:none;font-weight:600;">
      <a href="mailto:bookmarktube@yahoo.com" style="color:inherit;text-decoration:none;font-weight:inherit;">bookmarktube@yahoo.com</a>
      </span>
      <span style="display:inline-block;padding:0.625rem 1rem;border-radius:0.5rem;background:#111;color:#fff;text-decoration:none;font-weight:600;">
      <a href="https://x.com/riviereking" target="_blank" rel="noopener noreferrer" style="color:inherit;text-decoration:none;font-weight:inherit;">@riviereking</a>
      </span>
      </span>
      </p>
      </div>`
    )
  },
  'open': true
}

/**
 * Use as a state portion of a response to show a dialog client side
 * @param string 
 * @returns 
 */
export const alertState = <T = unknown>(string: T): TNetState => ({
  'dialog': alertDialogState(string) // Empty content by default
})

/**
 * Bootstrap state for dialogs light theme mode.
 * @returns object of all dialogs in light theme mode.
 *
 * @deprecated
 */
export function bootstrap_dialogs_light_state() {
  const dialogs: TStateAllDialogs = {}
  set_state_by_key(dialogs, signInDialogState)
  set_state_by_key(dialogs, passwordRecoveryDialogState)
  set_state_by_key(dialogs, confirmSignOutDialogState)
  // TODO: Don't forget to insert light mode state for each dialog

  return dialogs
}

/**
 * Bootstrap state for dialogs dark theme mode.
 * @returns object of all dialogs in dark theme mode.
 *
 * @deprecated
 */
export function bootstrap_dialogs_dark_state() {
  const dialogs: TStateAllDialogs = {}
  set_state_by_key(dialogs, $32DarkThemeMode)
  set_state_by_key(dialogs, $85DarkThemeMode)
  set_state_by_key(dialogs, $68DarkThemeMode)
  // TODO: Don't forget to insert dark mode state for each dialog

  return dialogs
}

/**
 * Get the dialog state to sign in.
 *
 * @param list of all dialogs
 * @param themeMode theme mode
 * @returns void
 */
function $get_signin_dialog_state(themeMode?: TThemeMode) {
  return themed(
    signInDialogState,
    $32DarkThemeMode,
    themeMode
  )
}

/**
 * Sign out dialog state.
 *
 * @param list of all dialogs
 * @param themeMode theme mode
 * @returns void
 */
function $get_signout_dialog_state (themeMode?: TThemeMode) {
  return themed(
    confirmSignOutDialogState,
    $68DarkThemeMode,
    themeMode
  )
}

/**
 * Bootstrap state for dialogs.
 *
 * @param themeMode 
 * @returns object of all dialogs.
 *
 * @deprecated
 */
export function bootstrap_dialogs_state(themeMode?: TThemeMode) {
  const dialogs: TStateAllDialogs = {}
  dialogs[key(signInDialogState)] = $get_signin_dialog_state(themeMode)
  dialogs[key(passwordRecoveryDialogState)] = themed(
    passwordRecoveryDialogState,
    $85DarkThemeMode,
    themeMode
  )
  dialogs[key(feedbackDialogState)] = themed(
    feedbackDialogState,
    $87DarkThemeMode,
    themeMode
  )
  dialogs[key(confirmSignOutDialogState)] = $get_signout_dialog_state(themeMode)

  // TODO Insert your new dialog here if you want it to be load in the
  //      bootstrapping process.

  return dialogs
}

/** Insert your new dialog state here so it can be lazy loaded */
export const STATE_DIALOGS_THEME_DARK: TStateAllDialogs = {
  [$2]: $2DarkThemeMode,
  [$6]: $6DarkThemeMode,
  [$7]: $7DarkThemeMode,
  [$8]: $8DarkThemeMode,
  [$11]: $11DarkThemeMode,
  [$14]: $14DarkThemeMode,
  [$15]: $15DarkThemeMode,
  [$16]: $16DarkThemeMode,
  [$21]: $21DarkThemeMode,
  [$22]: $22DarkThemeMode,
  [$23]: $23DarkThemeMode,
  [$26]: $26DarkThemeMode,
  [$27]: $27DarkThemeMode,
  [$30]: $30DarkThemeMode,
  [$31]: $31DarkThemeMode,
  [$32]: $32DarkThemeMode,
  [$33]: $33DarkThemeMode,
  [$34]: $34DarkThemeMode,
  [$35]: $35DarkThemeMode,
  [$36]: $36DarkThemeMode,
  [$37]: $37DarkThemeMode,
  [$85]: $85DarkThemeMode,
  [$94]: $94DarkThemeMode,
  [$95]: $95DarkThemeMode,
  [$87]: $87DarkThemeMode,
  [$68]: $68DarkThemeMode,
}

/** Insert your new dialog state here so it can be lazy loaded */
export const STATE_DIALOGS: { [key: string]: TStateDialog } = {
  [$2]: newVideoUrlDialogState,
  [$6]: newYoutubeBookmarkDialogState,
  [$7]: editYoutubeBookmarkDialogState,
  [$8]: newRumbleBookmarkDialogState,
  [$11]: editRumbleBookmarkDialogState,
  [$14]: newVimeoBookmarkDialogState,
  [$15]: editVimeoBookmarkDialogState,
  [$16]: newOdyseeBookmarkDialogState,
  [$21]: newDailyBookmarkDialogState,
  [$22]: editDailyBookmarkDialogState,
  [$23]: editOdyseeBookmarkDialogState,
  [$26]: newFacebookBookmarkDialogState,
  [$27]: editFacebookBookmarkDialogState,
  [$30]: newUnknownBookmarkDialogState,
  [$31]: editUnknownBookmarkDialogState,
  [$32]: signInDialogState,
  [$33]: registerDialogState,
  [$34]: deleteBookmarkDialogState,
  [$35]: clientAlertDialogState,
  [$36]: newTwitchBookmarkDialogState,
  [$37]: editTwitchBookmarkDialogState,
  [$85]: passwordRecoveryDialogState,
  [$94]: passwordRecoveryCodeDialogState,
  [$95]: passwordResetDialogState,
  [$87]: feedbackDialogState,
  [$68]: confirmSignOutDialogState,
}

export const get_contextualized_dialog_state = (key: string, usr?: TContextualUser) => {
  const base = clone_with_descriptors(STATE_DIALOGS)
  base[$31] = EditUnknownBookmarkDialogState.withContext(usr).light
  return base[key]
}

export const get_contextualized_dialog_state_dark = (key: string, usr?: TContextualUser) => {
  const base = clone_with_descriptors(STATE_DIALOGS_THEME_DARK)
  base[$31] = EditUnknownBookmarkDialogState.withContext(usr).dark
  return base[key]
}

export default function get_dialog_state(key: string): TStateDialog | undefined {
  return themed_by_key(key, STATE_DIALOGS, STATE_DIALOGS_THEME_DARK)
}