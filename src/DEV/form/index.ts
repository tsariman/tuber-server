import { TStateAllForms } from '@tuber/shared'
import STATE_KEY from '../../business.logic/state.key'
import devTestThumbnailFormState, {
  $45DarkThemeMode
} from './dev.test.thumbnail.form.state'
import devInstallFormState, { $47DarkThemeMode } from './dev.install.form.state'
import devSetAuthorizationKeyFormState, {
  $49DarkThemeMode
} from './dev.set.authorization.key.form.state'
import { TThemeMode } from '../../common.types'
import devTestRumbleRegexpFormState, {
  $54DarkThemeMode
} from './dev.test.rumble.regexp.form.state'
import devSetAuthorizationUrlFormState, {
  $50DarkThemeMode
} from './dev.set.authorization.url.form.state'
import devTestUnknownRegexpFormState, {
  $57DarkThemeMode
} from './dev.test.unknown.regexp.form.state'
import devTwitchInputClientIdFormState, {
  $60DarkThemeMode
} from './dev.twitch.input.client.id.form.state'
import devSaveConfigValueFormState, {
  $62DarkThemeMode
} from './dev.save.config.value.form.state'
import { get_state_key as key, themed } from '../../business.logic'

function $get_dev_install_form_state(themeMode?: TThemeMode) {
  return themed(
    devInstallFormState,
    $47DarkThemeMode,
    themeMode
  )
}

export function dev_bootstrap_forms_state(themeMode?: TThemeMode): TStateAllForms {
  const forms: TStateAllForms = {}
  forms[key(devInstallFormState)] = $get_dev_install_form_state(themeMode)

  // TODO Insert your new form here if you want it to be load in the
  //      bootstrapping process.

  return forms
}

export function dev_bootstrap_forms_light_state() {
  const forms: TStateAllForms = {}
  forms[key(devInstallFormState)] = devInstallFormState
  
  // TODO: Don't forget to insert light theme mode version of each form state.
  //       Note: The light theme mode is the original version.

  return forms
}

export function dev_bootstrap_forms_dark_state() {
  const forms: TStateAllForms = {}
  forms[key(devInstallFormState)] = $47DarkThemeMode

  // TODO: Don't forget to insert dark theme mode version of each form state.

  return forms
}

const $45 = STATE_KEY['45']
const $47 = STATE_KEY['47']
const $49 = STATE_KEY['49']
const $50 = STATE_KEY['50']
const $54 = STATE_KEY['54']
const $57 = STATE_KEY['57']
const $60 = STATE_KEY['60']
const $62 = STATE_KEY['62']

export const DEV_STATE_FORM_THEME_DARK: TStateAllForms = {
  [$45]: $45DarkThemeMode,
  [$47]: $47DarkThemeMode,
  [$49]: $49DarkThemeMode,
  [$50]: $50DarkThemeMode,
  [$54]: $54DarkThemeMode,
  [$57]: $57DarkThemeMode,
  [$60]: $60DarkThemeMode,
  [$62]: $62DarkThemeMode,
}

const DEV_STATE_FORM: TStateAllForms = {
  [$45]: devTestThumbnailFormState,
  [$47]: devInstallFormState,
  [$49]: devSetAuthorizationKeyFormState,
  [$50]: devSetAuthorizationUrlFormState,
  [$54]: devTestRumbleRegexpFormState,
  [$57]: devTestUnknownRegexpFormState,
  [$60]: devTwitchInputClientIdFormState,
  [$62]: devSaveConfigValueFormState,
}

export default DEV_STATE_FORM

