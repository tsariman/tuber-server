import * as C from '../../constants'
import devTestThumbnailFormState from './dev.test.thumbnail.form.state'
import devInstallFormState from './dev.install.form.state'
import devSetAuthorizationKeyFormState from './dev.set.authorization.key.form.state'
import { TStateAllForms } from '../../common.types'
import devTestRumbleRegexpFormState from './dev.test.rumble.regexp.form.state'
import devSetAuthorizationUrlFormState from './dev.set.authorization.url.form.state'

const DEV_STATE_FORM: TStateAllForms = {
  [C.$45_KEY]: devTestThumbnailFormState,
  [C.$47_KEY]: devInstallFormState,
  [C.$49_KEY]: devSetAuthorizationKeyFormState,
  [C.$50_KEY]: devSetAuthorizationUrlFormState,
  [C.$54_KEY]: devTestRumbleRegexpFormState,
}

export default DEV_STATE_FORM