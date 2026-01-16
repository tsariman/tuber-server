import * as C from '@tuber/shared';
import newVideoUrlFormState, {
  $1DarkThemeMode
} from './new.video.url.form.state';
import newYouTubeBookmarkFormState, {
  $4DarkThemeMode
} from './new.youtube.bookmark.form.state';
import editYouTubeBookmarkFormState, {
  $5DarkThemeMode
} from './edit.youtube.bookmark.form.state';
import newRumbleBookmarkFormState, {
  $9DarkThemeMode
} from './new.rumble.bookmark.form.state';
import editRumbleBookmarkFormState, {
  $10DarkThemeMode
} from './edit.rumble.bookmark.form.state';
import newVimeoBookmarkFormState, {
  $12DarkThemeMode
} from './new.vimeo.bookmark.form.state';
import editVimeoBookmarkFormState, {
  $13DarkThemeMode
} from './edit.vimeo.bookmark.form.state';
import newOdyseeBookmarkFormState, {
  $17DarkThemeMode
} from './new.odysee.bookmark.form.state';
import editOdyseeBookmarkFormState, {
  $18DarkThemeMode
} from './edit.odysee.bookmark.form.state';
import newDailyBookmarkFormState, {
  $19DarkThemeMode
} from './new.daily.bookmark.form.state';
import editDailyBookmarkFormState, {
  $20DarkThemeMode
} from './edit.daily.bookmark.form.state';
import newFacebookBookmarkFormState, {
  $24DarkThemeMode
} from './new.facebook.bookmark.form.state';
import editFacebookBookmarkFormState, {
  $25DarkThemeMode
} from './edit.facebook.bookmark.form.state';
import newUnknownBookmarkFormState, {
  $28DarkThemeMode
} from './new.unknown.bookmark.form.state';
import editUnknownBookmarkFormState, {
  $29DarkThemeMode
} from './edit.unknown.bookmark.form.state';
import newTwitchBookmarkFormState, {
  $38DarkThemeMode
} from './new.twitch.bookmark.form.state';
import editTwitchBookmarkFormState, {
  $39DarkThemeMode
} from './edit.twitch.bookmark.form.state';
import signInFormState, {
  $41DarkThemeMode
} from './sign.in.form.state';
import Config from '../../config';
import { TThemeMode } from '../../common.types';
import DEV_STATE_FORM, {
  DEV_STATE_FORM_THEME_DARK,
  dev_bootstrap_forms_dark_state,
  dev_bootstrap_forms_light_state,
  dev_bootstrap_forms_state
} from '../../dev/form';
import {
  get_state_key as key,
  set_state_by_key,
  themed,
  themed_by_key
} from '../../business.logic';
import newUserFormState, { $69DarkThemeMode } from './new.user.form.state';
import { TContextualUser } from '../../schema/user';
import { is_dev } from '../../model/user/access';

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
  );
}

/** @deprecated */
export function bootstrap_forms_state(
  usr?: TContextualUser,
  themeMode?: TThemeMode
): C.TStateAllForms {
  const forms: C.TStateAllForms = {
    ...(is_dev(usr) ? dev_bootstrap_forms_state(themeMode) : {})
  };
  forms[key(signInFormState)] = _get_signin_form_state(themeMode);

  // TODO Insert your new form here if you want it to be load in the
  //      bootstrapping process.

  return forms;
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
  const forms: C.TStateAllForms = {
    ...(is_dev(usr) ? dev_bootstrap_forms_light_state() : {})
  };
  set_state_by_key(forms, signInFormState);

  // TODO: Don't forget to insert light mode version of each form state.
  //       Note: The light mode is the original version.

  return forms;
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
  const forms: C.TStateAllForms = {
    ...(is_dev(usr) ? dev_bootstrap_forms_dark_state() : {})
  };
  set_state_by_key(forms, $41DarkThemeMode);

  // TODO: Don't forget to insert dark mode version of each form state.

  return forms;
}

export const STATE_FORMS_THEME_DARK: C.TStateAllForms = {
  [C.$1_STATE_KEY]: $1DarkThemeMode,
  [C.$4_STATE_KEY]: $4DarkThemeMode,
  [C.$5_STATE_KEY]: $5DarkThemeMode,
  [C.$9_STATE_KEY]: $9DarkThemeMode,
  [C.$10_STATE_KEY]: $10DarkThemeMode,
  [C.$12_STATE_KEY]: $12DarkThemeMode,
  [C.$13_STATE_KEY]: $13DarkThemeMode,
  [C.$17_STATE_KEY]: $17DarkThemeMode,
  [C.$18_STATE_KEY]: $18DarkThemeMode,
  [C.$19_STATE_KEY]: $19DarkThemeMode,
  [C.$20_STATE_KEY]: $20DarkThemeMode,
  [C.$24_STATE_KEY]: $24DarkThemeMode,
  [C.$25_STATE_KEY]: $25DarkThemeMode,
  [C.$28_STATE_KEY]: $28DarkThemeMode,
  [C.$29_STATE_KEY]: $29DarkThemeMode,
  [C.$38_STATE_KEY]: $38DarkThemeMode,
  [C.$39_STATE_KEY]: $39DarkThemeMode,
  [C.$41_STATE_KEY]: $41DarkThemeMode,
  [C.$69_STATE_KEY]: $69DarkThemeMode,
  ...(Config.DEV ? DEV_STATE_FORM_THEME_DARK : {})
};

export const STATE_FORMS: C.TStateAllForms = {
  [C.$1_STATE_KEY]: newVideoUrlFormState,
  [C.$4_STATE_KEY]: newYouTubeBookmarkFormState,
  [C.$5_STATE_KEY]: editYouTubeBookmarkFormState,
  [C.$9_STATE_KEY]: newRumbleBookmarkFormState,
  [C.$10_STATE_KEY]: editRumbleBookmarkFormState,
  [C.$12_STATE_KEY]: newVimeoBookmarkFormState,
  [C.$13_STATE_KEY]: editVimeoBookmarkFormState,
  [C.$17_STATE_KEY]: newOdyseeBookmarkFormState,
  [C.$18_STATE_KEY]: editOdyseeBookmarkFormState,
  [C.$19_STATE_KEY]: newDailyBookmarkFormState,
  [C.$20_STATE_KEY]: editDailyBookmarkFormState,
  [C.$24_STATE_KEY]: newFacebookBookmarkFormState,
  [C.$25_STATE_KEY]: editFacebookBookmarkFormState,
  [C.$28_STATE_KEY]: newUnknownBookmarkFormState,
  [C.$29_STATE_KEY]: editUnknownBookmarkFormState,
  [C.$38_STATE_KEY]: newTwitchBookmarkFormState,
  [C.$39_STATE_KEY]: editTwitchBookmarkFormState,
  [C.$41_STATE_KEY]: signInFormState,
  [C.$69_STATE_KEY]: newUserFormState,
  ...(Config.DEV ? DEV_STATE_FORM : {})
};

export default function get_form_state(key: string) {
  return themed_by_key(key, STATE_FORMS, STATE_FORMS_THEME_DARK);
};
