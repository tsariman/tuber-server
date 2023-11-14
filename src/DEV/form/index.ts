import { $45_KEY, $47_KEY, $49_KEY } from '../../constants'
import devTestThumbnailFormState from './dev.test.thumbnail.form.state'
import devInstallFormState from './dev.install.form.state'
import devSetAuthorizationKeyFormState from './dev.set.authorization.key.form.state'
import { TStateAllForms } from '../../common.types'

const DEV_STATE_FORM: TStateAllForms = {
  [$45_KEY]: devTestThumbnailFormState,
  [$47_KEY]: devInstallFormState,
  [$49_KEY]: devSetAuthorizationKeyFormState,
}

export default DEV_STATE_FORM