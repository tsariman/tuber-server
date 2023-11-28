import * as C from '../../constants'
import devTestThumbnailFormState, {
  $45DarkThemeMode
} from './dev.test.thumbnail.form.state'
import devInstallFormState, { $47DarkThemeMode } from './dev.install.form.state'
import devSetAuthorizationKeyFormState, {
  $49DarkThemeMode
} from './dev.set.authorization.key.form.state'
import { TStateAllForms } from '../../common.types'
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

export const DEV_STATE_FORM_THEME_DARK: TStateAllForms = {
  [C.$45_STATE_KEY]: $45DarkThemeMode,
  [C.$47_STATE_KEY]: $47DarkThemeMode,
  [C.$49_STATE_KEY]: $49DarkThemeMode,
  [C.$50_STATE_KEY]: $50DarkThemeMode,
  [C.$54_STATE_KEY]: $54DarkThemeMode,
  [C.$57_STATE_KEY]: $57DarkThemeMode,
  [C.$60_STATE_KEY]: $60DarkThemeMode,
  [C.$62_STATE_KEY]: $62DarkThemeMode,
}

const DEV_STATE_FORM: TStateAllForms = {
  [C.$45_STATE_KEY]: devTestThumbnailFormState,
  [C.$47_STATE_KEY]: devInstallFormState,
  [C.$49_STATE_KEY]: devSetAuthorizationKeyFormState,
  [C.$50_STATE_KEY]: devSetAuthorizationUrlFormState,
  [C.$54_STATE_KEY]: devTestRumbleRegexpFormState,
  [C.$57_STATE_KEY]: devTestUnknownRegexpFormState,
  [C.$60_STATE_KEY]: devTwitchInputClientIdFormState,
  [C.$62_STATE_KEY]: devSaveConfigValueFormState,
}

export default DEV_STATE_FORM

