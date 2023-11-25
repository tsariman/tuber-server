import * as C from '../../constants'
import newVideoUrlFormState, {
  $1DarkThemeMode
} from './new.video.url.form.state'
import newYouTubeBookmarkFormState, {
  $4DarkThemeMode
} from './new.youtube.bookmark.form.state'
import editYouTubeBookmarkFormState, {
  $5DarkThemeMode
} from './edit.youtube.bookmark.form.state'
import newRumbleBookmarkFormState, {
  $9DarkThemeMode
} from './new.rumble.bookmark.form.state'
import editRumbleBookmarkFormState, {
  $10DarkThemeMode
} from './edit.rumble.bookmark.form.state'
import newVimeoBookmarkFormState, {
  $12DarkThemeMode
} from './new.vimeo.bookmark.form.state'
import editVimeoBookmarkFormState, {
  $13DarkThemeMode
} from './edit.vimeo.bookmark.form.state'
import newOdyseeBookmarkFormState, {
  $17DarkThemeMode
} from './new.odysee.bookmark.form.state'
import editOdyseeBookmarkFormState, {
  $18DarkThemeMode
} from './edit.odysee.bookmark.form.state'
import newDailyBookmarkFormState, {
  $19DarkThemeMode
} from './new.daily.bookmark.form.state'
import editDailyBookmarkFormState, {
  $20DarkThemeMode
} from './edit.daily.bookmark.form.state'
import newFacebookBookmarkFormState, {
  $24DarkThemeMode
} from './new.facebook.bookmark.form.state'
import editFacebookBookmarkFormState, {
  $25DarkThemeMode
} from './edit.facebook.bookmark.form.state'
import newUnknownBookmarkFormState, {
  $28DarkThemeMode
} from './new.unknown.bookmark.form.state'
import editUnknownBookmarkFormState, {
  $29DarkThemeMode
} from './edit.unknown.bookmark.form.state'
import newTwitchBookmarkFormState, {
  $38DarkThemeMode
} from './new.twitch.bookmark.form.state'
import editTwitchBookmarkFormState, {
  $39DarkThemeMode
} from './edit.twitch.bookmark.form.state'
import loginFormState, {
  $41DarkThemeMode
} from './login.form.state'
import Config from '../../config'
import { TStateAllForms } from '../../common.types'
import DEV_STATE_FORM, { DEV_STATE_FORM_THEME_DARK } from '../../DEV/form'

export const STATE_FORMS_THEME_DARK: TStateAllForms = {
  [C.$1_KEY]: $1DarkThemeMode,
  [C.$4_KEY]: $4DarkThemeMode,
  [C.$5_KEY]: $5DarkThemeMode,
  [C.$9_KEY]: $9DarkThemeMode,
  [C.$10_KEY]: $10DarkThemeMode,
  [C.$12_KEY]: $12DarkThemeMode,
  [C.$13_KEY]: $13DarkThemeMode,
  [C.$17_KEY]: $17DarkThemeMode,
  [C.$18_KEY]: $18DarkThemeMode,
  [C.$19_KEY]: $19DarkThemeMode,
  [C.$20_KEY]: $20DarkThemeMode,
  [C.$24_KEY]: $24DarkThemeMode,
  [C.$25_KEY]: $25DarkThemeMode,
  [C.$28_KEY]: $28DarkThemeMode,
  [C.$29_KEY]: $29DarkThemeMode,
  [C.$38_KEY]: $38DarkThemeMode,
  [C.$39_KEY]: $39DarkThemeMode,
  [C.$41_KEY]: $41DarkThemeMode,
  ...(Config.DEV ? DEV_STATE_FORM_THEME_DARK : {})
}

const STATE_FORMS: TStateAllForms = {
  [C.$1_KEY]: newVideoUrlFormState,
  [C.$4_KEY]: newYouTubeBookmarkFormState,
  [C.$5_KEY]: editYouTubeBookmarkFormState,
  [C.$9_KEY]: newRumbleBookmarkFormState,
  [C.$10_KEY]: editRumbleBookmarkFormState,
  [C.$12_KEY]: newVimeoBookmarkFormState,
  [C.$13_KEY]: editVimeoBookmarkFormState,
  [C.$17_KEY]: newOdyseeBookmarkFormState,
  [C.$18_KEY]: editOdyseeBookmarkFormState,
  [C.$19_KEY]: newDailyBookmarkFormState,
  [C.$20_KEY]: editDailyBookmarkFormState,
  [C.$24_KEY]: newFacebookBookmarkFormState,
  [C.$25_KEY]: editFacebookBookmarkFormState,
  [C.$28_KEY]: newUnknownBookmarkFormState,
  [C.$29_KEY]: editUnknownBookmarkFormState,
  [C.$38_KEY]: newTwitchBookmarkFormState,
  [C.$39_KEY]: editTwitchBookmarkFormState,
  [C.$41_KEY]: loginFormState,
  ...(Config.DEV ? DEV_STATE_FORM : {})
}

export default STATE_FORMS