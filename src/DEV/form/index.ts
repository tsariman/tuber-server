import { $45_KEY, $47_KEY, $49_KEY } from '../../constants'
import IStateAllForms from '../../../../tuber-client/src/controllers/interfaces/IStateAllForms'
import devTestThumbnailFormState from './dev.test.thumbnail.form.state'
import devInstallFormState from './dev.install.form.state'
import devSetAuthorizationKeyFormState from './dev.set.authorization.key.form.state'

const DEV_STATE_FORM: IStateAllForms = {
  [$45_KEY]: devTestThumbnailFormState,
  [$47_KEY]: devInstallFormState,
  [$49_KEY]: devSetAuthorizationKeyFormState,
}

export default DEV_STATE_FORM