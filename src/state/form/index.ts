import {
  TStateAllForms
} from '@tuber/shared'
import {
  newVideoUrlFormState,
  $1DarkThemeMode
} from './new.video.url.form.state'
import {
  newYouTubeBookmarkFormState,
  $4DarkThemeMode
} from './new.youtube.bookmark.form.state'
import {
  editYouTubeBookmarkFormState,
  $5DarkThemeMode,
  EditYouTubeBookmarkFormState
} from './edit.youtube.bookmark.form.state'
import {
  newRumbleBookmarkFormState,
  $9DarkThemeMode
} from './new.rumble.bookmark.form.state'
import {
  editRumbleBookmarkFormState,
  $10DarkThemeMode,
  EditRumbleBookmarkFormState
} from './edit.rumble.bookmark.form.state'
import {
  newVimeoBookmarkFormState,
  $12DarkThemeMode
} from './new.vimeo.bookmark.form.state'
import {
  editVimeoBookmarkFormState,
  $13DarkThemeMode,
  EditVimeoBookmarkFormState
} from './edit.vimeo.bookmark.form.state'
import {
  newOdyseeBookmarkFormState,
  $17DarkThemeMode
} from './new.odysee.bookmark.form.state'
import {
  editOdyseeBookmarkFormState,
  $18DarkThemeMode,
  EditOdyseeBookmarkFormState
} from './edit.odysee.bookmark.form.state'
import  {
  newDailyBookmarkFormState,
  $19DarkThemeMode
} from './new.daily.bookmark.form.state'
import EditDailyBookmarkFormState from './edit.daily.bookmark.form.state'
import {
  newFacebookBookmarkFormState,
  $24DarkThemeMode
} from './new.facebook.bookmark.form.state'
import {
  editFacebookBookmarkFormState,
  $25DarkThemeMode,
  EditFacebookBookmarkFormState
} from './edit.facebook.bookmark.form.state'
import {
  newUnknownBookmarkFormState,
  $28DarkThemeMode
} from './new.unknown.bookmark.form.state'
import {
  editUnknownBookmarkFormState,
  $29DarkThemeMode,
  EditUnknownBookmarkFormState
} from './edit.unknown.bookmark.form.state'
import {
  newTwitchBookmarkFormState,
  $38DarkThemeMode
} from './new.twitch.bookmark.form.state'
import {
  editTwitchBookmarkFormState,
  $39DarkThemeMode,
  EditTwitchBookmarkFormState
} from './edit.twitch.bookmark.form.state'
import {
  signInFormState,
  $41DarkThemeMode
} from './sign.in.form.state'
import {
  passwordRecoveryFormState,
  $86DarkThemeMode
} from './password.recovery.form.state'
import {
  editUserFormState,
  $82DarkThemeMode
} from './edit.user.form.state'
import Config from '../../config'
import { TThemeMode } from '../../common.types'
import DEV_STATE_FORM, {
  DEV_STATE_FORM_THEME_DARK,
  dev_bootstrap_forms_dark_state,
  dev_bootstrap_forms_light_state,
  dev_bootstrap_forms_state
} from '../../dev/form'
import {
  clone_with_descriptors,
  get_state_key as key,
  set_state_by_key,
  themed,
  themed_by_key
} from '../../business.logic'
import { newUserFormState, $69DarkThemeMode } from './new.user.form.state'
import { TContextualUser } from '../../schema/user'
import { is_dev } from '../../model/user/access'
import STATE_KEY from '../../business.logic/state.key'
import Access from '../../business.logic/security/Access'

const $1 = STATE_KEY['1']
const $4 = STATE_KEY['4']
const $5 = STATE_KEY['5']
const $9 = STATE_KEY['9']
const $10 = STATE_KEY['10']
const $12 = STATE_KEY['12']
const $13 = STATE_KEY['13']
const $17 = STATE_KEY['17']
const $18 = STATE_KEY['18']
const $19 = STATE_KEY['19']
const $20 = STATE_KEY['20']
const $24 = STATE_KEY['24']
const $25 = STATE_KEY['25']
const $28 = STATE_KEY['28']
const $29 = STATE_KEY['29']
const $38 = STATE_KEY['38']
const $39 = STATE_KEY['39']
const $41 = STATE_KEY['41']
const $69 = STATE_KEY['69']
const $82 = STATE_KEY['82']
const $86 = STATE_KEY['86']

/**
 * Get the sign in form state.
 *
 * @param list of all forms
 * @param themeMode theme mode
 * @returns void
 */
function _get_signin_form_state(themeMode?: TThemeMode) {
  return themed(
    signInFormState,
    $41DarkThemeMode,
    themeMode
  )
}

/** @deprecated */
export function bootstrap_forms_state(
  usr?: TContextualUser,
  themeMode?: TThemeMode
): TStateAllForms {
  const forms: TStateAllForms = {
    ...(is_dev(usr) ? dev_bootstrap_forms_state(themeMode) : {})
  }
  forms[key(signInFormState)] = _get_signin_form_state(themeMode)
  forms[key(passwordRecoveryFormState)] = themed(
    passwordRecoveryFormState,
    $86DarkThemeMode,
    themeMode
  )

  // TODO Insert your new form here if you want it to be load in the
  //      bootstrapping process.

  return forms
}

/**
 * Bootstrap state for forms light theme mode.
 *
 * @param usr user object decoded from user token
 * @returns light theme mode forms state
 *
 * @deprecated
 */
export function bootstrap_forms_light_state(usr?: TContextualUser) {
  const forms: TStateAllForms = {
    ...(is_dev(usr) ? dev_bootstrap_forms_light_state() : {})
  }
  set_state_by_key(forms, signInFormState)
  set_state_by_key(forms, passwordRecoveryFormState)

  // TODO: Don't forget to insert light mode version of each form state.
  //       Note: The light mode is the original version.

  return forms
}

/**
 * Bootstrap state for forms dark theme mode.
 *
 * @param usr user object decoded from user token
 * @returns dark theme mode forms state
 * 
 * @deprecated
 */
export function bootstrap_forms_dark_state(usr?: TContextualUser) {
  const forms: TStateAllForms = {
    ...(is_dev(usr) ? dev_bootstrap_forms_dark_state() : {})
  }
  set_state_by_key(forms, $41DarkThemeMode)
  set_state_by_key(forms, $86DarkThemeMode)

  // TODO: Don't forget to insert dark mode version of each form state.

  return forms
}

/** @deprecated */
export const STATE_FORMS_THEME_DARK: TStateAllForms = {
  [$1]: $1DarkThemeMode,
  [$4]: $4DarkThemeMode,
  [$5]: $5DarkThemeMode,
  [$9]: $9DarkThemeMode,
  [$10]: $10DarkThemeMode,
  [$12]: $12DarkThemeMode,
  [$13]: $13DarkThemeMode,
  [$17]: $17DarkThemeMode,
  [$18]: $18DarkThemeMode,
  [$19]: $19DarkThemeMode,
  // [$20]: $20DarkThemeMode,
  [$24]: $24DarkThemeMode,
  [$25]: $25DarkThemeMode,
  [$28]: $28DarkThemeMode,
  [$29]: $29DarkThemeMode,
  [$38]: $38DarkThemeMode,
  [$39]: $39DarkThemeMode,
  [$41]: $41DarkThemeMode,
  [$86]: $86DarkThemeMode,
  [$69]: $69DarkThemeMode,
  ...(Config.DEV ? DEV_STATE_FORM_THEME_DARK : {})
}

/** @deprecated */
export const STATE_FORMS: TStateAllForms = {
  [$1]: newVideoUrlFormState,
  [$4]: newYouTubeBookmarkFormState,
  [$5]: editYouTubeBookmarkFormState,
  [$9]: newRumbleBookmarkFormState,
  [$10]: editRumbleBookmarkFormState,
  [$12]: newVimeoBookmarkFormState,
  [$13]: editVimeoBookmarkFormState,
  [$17]: newOdyseeBookmarkFormState,
  [$18]: editOdyseeBookmarkFormState,
  [$19]: newDailyBookmarkFormState,
  // [$20]: editDailyBookmarkFormState,
  [$24]: newFacebookBookmarkFormState,
  [$25]: editFacebookBookmarkFormState,
  [$28]: newUnknownBookmarkFormState,
  [$29]: editUnknownBookmarkFormState,
  [$38]: newTwitchBookmarkFormState,
  [$39]: editTwitchBookmarkFormState,
  [$41]: signInFormState,
  [$86]: passwordRecoveryFormState,
  [$69]: newUserFormState,
  ...(Config.DEV ? DEV_STATE_FORM : {})
}

/**
 * Get the form state for a given key, contextualized based on the user's
 * access rights, for light theme mode.
 * @param usr user object decoded from user token
 * @param key form state key
 * @returns light theme mode form state
 */
export const get_contextualized_form_state = (key: string, usr?: TContextualUser) => {
  const base = clone_with_descriptors(STATE_FORMS)
  base[$5] = EditYouTubeBookmarkFormState.withContext(usr).light
  base[$10] = EditRumbleBookmarkFormState.withContext(usr).light
  base[$13] = EditVimeoBookmarkFormState.withContext(usr).light
  base[$18] = EditOdyseeBookmarkFormState.withContext(usr).light
  base[$20] = EditDailyBookmarkFormState.withContext(usr).light
  base[$25] = EditFacebookBookmarkFormState.withContext(usr).light
  base[$29] = EditUnknownBookmarkFormState.withContext(usr).light
  base[$39] = EditTwitchBookmarkFormState.withContext(usr).light
  if (Access.the(usr).hasClearance('free').then) {
    base[$82] = editUserFormState
  }
  return base[key]
}

/**
 * Get the form state for a given key, contextualized based on the user's
 * access rights, for dark theme mode.
 * @param usr user object decoded from user token
 * @param key form state key
 * @returns dark theme mode form state
 */
export const get_contextualized_form_state_dark = (key: string, usr?: TContextualUser) => {
  const base = clone_with_descriptors(STATE_FORMS_THEME_DARK)
  base[$5] = EditYouTubeBookmarkFormState.withContext(usr).dark
  base[$10] = EditRumbleBookmarkFormState.withContext(usr).dark
  base[$13] = EditVimeoBookmarkFormState.withContext(usr).dark
  base[$18] = EditOdyseeBookmarkFormState.withContext(usr).dark
  base[$20] = EditDailyBookmarkFormState.withContext(usr).dark
  base[$25] = EditFacebookBookmarkFormState.withContext(usr).dark
  base[$29] = EditUnknownBookmarkFormState.withContext(usr).dark
  base[$39] = EditTwitchBookmarkFormState.withContext(usr).dark
  if (Access.the(usr).hasClearance('free').then) {
    base[$82] = $82DarkThemeMode
  }
  return base[key]
}

/** Not in use @deprecated Removal is imminent */
export default function get_form_state(key: string) {
  return themed_by_key(key, STATE_FORMS, STATE_FORMS_THEME_DARK)
}
