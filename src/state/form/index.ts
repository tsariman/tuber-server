import IStateAllForms from '../../../../tuber-client/src/controllers/interfaces/IStateAllForms'
import * as C from '../../constants'
import newVideoUrlFormState from './new.video.url.form.state'
import newYouTubeBookmarkFormState from './new.youtube.bookmark.form.state'
import editYouTubeBookmarkFormState from './edit.youtube.bookmark.form.state'
import newRumbleBookmarkFormState from './new.rumble.bookmark.form.state'
import editRumbleBookmarkFormState from './edit.rumble.bookmark.form.state'
import newVimeoBookmarkFormState from './new.vimeo.bookmark.form.state'
import editVimeoBookmarkFormState from './edit.vimeo.bookmark.form.state'
import newOdyseeBookmarkFormState from './new.odysee.bookmark.form.state'
import editOdyseeBookmarkFormState from './edit.odysee.bookmark.form.state'
import newDailyBookmarkFormState from './new.daily.bookmark.form.state'
import editDailyBookmarkFormState from './edit.daily.bookmark.form.state'
import newFacebookBookmarkFormState from './new.facebook.bookmark.form.state'
import editFacebookBookmarkFormState from './edit.facebook.bookmark.form.state'
import newUnknownBookmarkFormState from './new.unknown.bookmark.form.state'
import editUnknownBookmarkFormState from './edit.unknown.bookmark.form.state'
import newTwitchBookmarkFormState from './new.twitch.bookmark.form.state'
import editTwitchBookmarkFormState from './edit.twitch.bookmark.form.state'
import loginFormState from './login.form.state'
import Config from '../../config'
import devTestThumbnailFormState from '../../DEV/form/dev.test.thumbnail.form.state'
import devSetAuthorizationKeyFormState from 'src/DEV/form/dev.set.authorization.key.form.state'
import devInstallFormState from 'src/DEV/form/dev.install.form.state'

const STATE_FORMS: IStateAllForms = {
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
}

if (Config.DEV) {
  STATE_FORMS[C.$45_KEY] = devTestThumbnailFormState
  STATE_FORMS[C.$47_KEY] = devInstallFormState
  STATE_FORMS[C.$49_KEY] = devSetAuthorizationKeyFormState
}

export default STATE_FORMS