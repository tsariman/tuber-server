import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Config from '../config'
import IStateApp from '../../../tuber-client/src/controllers/interfaces/IStateApp'
import { backgroundState } from '../state'
import {
  loginDialogState,
  newYoutubeAnnotationDialogState,
  newVideoUrlDialogState,
  editYoutubeAnnotationDialogState,
  deleteAnnotationDialogState,
  clientAlertDialogState
} from '../state/dialogs'
import { loginPage } from '../state/pages'
import { defaultAppBarState } from '../state/default.content'
import themeState from '../state/theme.state'
import IStateAllPages from '../../../tuber-client/src/controllers/interfaces/IStateAllPages'
import IStateAllForms from '../../../tuber-client/src/controllers/interfaces/IStateAllForms'
import IStateAllDialogs from '../../../tuber-client/src/controllers/interfaces/IStateAllDialogs'
import IStateAppBar from '../../../tuber-client/src/controllers/interfaces/IStateAppBar'
import devInstallPageState from '../INSTALL.DEV/dev.install.page.state'
import devSignedInAppBar from '../INSTALL.DEV/dev.signedin-appbar.page.state'
import devInstallForm from '../INSTALL.DEV/dev.install.form.state'
import researchPageState from '../state/pages/research.page.state'
import loginFormState from '../state/forms/login.form.state'
import newYouTubeAnnotationFormState from '../state/forms/new.youtube.annotation.form.state'
import researchPageAppBarState from '../state/appBar/research.page.appbar.state'
import {
  homeLinkState,
  annotationAddFromUrlLinkState,
  powerLinkState,
  defaultErrorsViewLinkState
} from '../state/nav.link'
import newVideoUrlFormState from '../state/forms/new.video.url.form.state'
import { get_state_key, set_state_by_key } from '../business.logic'
import { get_documents_count } from '../INSTALL.DEV'
import editYouTubeAnnotationFormState from '../state/forms/edit.youtube.annotation.form.state'
import { IBootstrapResponse } from '../business.logic/common.types'
import newRumbleAnnotationFormState from '../state/forms/new.rumble.annotation.form.state'
import newRumbleAnnotationDialogState from '../state/dialogs/new.rumble.dialog'
import editRumbleAnnotationFormState from '../state/forms/edit.rumble.annotation.form.state'
import editRumbleAnnotationDialogState from '../state/dialogs/edit.rumble.dialog'
import newVimeoAnnotationFormState from '../state/forms/new.vimeo.annotation.form.state'
import editVimeoAnnotationFormState from '../state/forms/edit.vimeo.annotation.form.state'
import newVimeoAnnotationDialogState from '../state/dialogs/new.vimeo.dialog'
import editVimeoAnnotationDialogState from '../state/dialogs/edit.vimeo.dialog'
import newOdyseeAnnotationFormState from '../state/forms/new.odysee.annotation.form.state'
import editOdyseeAnnotationFormState from '../state/forms/edit.odysee.annotation.form.state'
import newDailyAnnotationFormState from '../state/forms/new.daily.annotation.form.state'
import newOdyseeAnnotationDialogState from '../state/dialogs/new.odysee.dialog'
import newDailyAnnotationDialogState from '../state/dialogs/new.daily.dialog'
import editDailyAnnotationDialogState from '../state/dialogs/edit.daily.dialog'
import editOdyseeAnnotationDialogState from '../state/dialogs/edit.odysee.dialog'
import newFacebookAnnotationFormState from '../state/forms/new.facebook.annotation.form.state'
import editFacebookAnnotationFormState from '../state/forms/edit.facebook.annotation.form.state'
import newFacebookAnnotationDialogState from '../state/dialogs/new.facebook.dialog'
import editFacebookAnnotationDialogState from '../state/dialogs/edit.facebook.dialog'
import newUnknownAnnotationFormState from '../state/forms/new.unknown.annotation.form.state'
import editUnknownAnnotationFormState from '../state/forms/edit.unknown.annotation.form.state'
import newUnknownAnnotationDialogState from '../state/dialogs/new.unknown.dialog'
import editUnknownAnnotationDialogState from '../state/dialogs/edit.unknown.dialog'
import editDailyAnnotationFormState from '../state/forms/edit.daily.annotation.form.state'
import newTwitchAnnotationDialogState from 'src/state/dialogs/new.twitch.dialog'
import editTwitchAnnotationDialogState from 'src/state/dialogs/edit.twitch.dialog'
import newTwitchAnnotationFormState from 'src/state/forms/new.twitch.annotation.form.state'
import editTwitchAnnotationFormState from 'src/state/forms/edit.twitch.annotation.form.state'

export default async function bootstrap_controller(fastify: FastifyInstance) {

  /** Application configuration */
  const appState: IStateApp = {
    'inDebugMode': false,
    'inDevelMode': false,
    'logoUri': '../tuber.png',
    // 'logoWidth': 212,
    // 'logoHeight': 35,
    'title': '[DEV] Tuberesearcher',
    'homePage': 'login',
    'spinnerDisabled': true,
    'isBootstrapped': true
  }

  const appBarState: IStateAppBar = {
    ...defaultAppBarState
  }

  const pagesState: IStateAllPages = {}
  set_state_by_key(pagesState, loginPage)
  // TODO: Insert more pages here

  const formsState: IStateAllForms = {}
  set_state_by_key(formsState, loginFormState)
  set_state_by_key(formsState, newYouTubeAnnotationFormState)
  set_state_by_key(formsState, newRumbleAnnotationFormState)
  set_state_by_key(formsState, editYouTubeAnnotationFormState)
  set_state_by_key(formsState, editRumbleAnnotationFormState)
  set_state_by_key(formsState, newVimeoAnnotationFormState)
  set_state_by_key(formsState, editVimeoAnnotationFormState)
  set_state_by_key(formsState, newOdyseeAnnotationFormState)
  set_state_by_key(formsState, editOdyseeAnnotationFormState)
  set_state_by_key(formsState, newDailyAnnotationFormState)
  set_state_by_key(formsState, editDailyAnnotationFormState)
  set_state_by_key(formsState, newFacebookAnnotationFormState)
  set_state_by_key(formsState, editFacebookAnnotationFormState)
  set_state_by_key(formsState, newUnknownAnnotationFormState)
  set_state_by_key(formsState, editUnknownAnnotationFormState)
  set_state_by_key(formsState, newTwitchAnnotationFormState)
  set_state_by_key(formsState, editTwitchAnnotationFormState)
  set_state_by_key(formsState, newVideoUrlFormState)
  // TODO: Insert more forms here

  const dialogsState: IStateAllDialogs = {}
  set_state_by_key(dialogsState, newYoutubeAnnotationDialogState)
  set_state_by_key(dialogsState, newRumbleAnnotationDialogState)
  set_state_by_key(dialogsState, editYoutubeAnnotationDialogState)
  set_state_by_key(dialogsState, editRumbleAnnotationDialogState)
  set_state_by_key(dialogsState, newVimeoAnnotationDialogState)
  set_state_by_key(dialogsState, editVimeoAnnotationDialogState)
  set_state_by_key(dialogsState, newOdyseeAnnotationDialogState)
  set_state_by_key(dialogsState, editOdyseeAnnotationDialogState)
  set_state_by_key(dialogsState, newDailyAnnotationDialogState)
  set_state_by_key(dialogsState, editDailyAnnotationDialogState)
  set_state_by_key(dialogsState, newFacebookAnnotationDialogState)
  set_state_by_key(dialogsState, editFacebookAnnotationDialogState)
  set_state_by_key(dialogsState, newTwitchAnnotationDialogState)
  set_state_by_key(dialogsState, editTwitchAnnotationDialogState)
  set_state_by_key(dialogsState, newUnknownAnnotationDialogState)
  set_state_by_key(dialogsState, editUnknownAnnotationDialogState)
  set_state_by_key(dialogsState, loginDialogState)
  set_state_by_key(dialogsState, newVideoUrlDialogState)
  set_state_by_key(dialogsState, deleteAnnotationDialogState)
  set_state_by_key(dialogsState, clientAlertDialogState)
  // TODO: Insert more dialogs here

  const pagesData = {} as { [key: string]: any }

  fastify.post('/', async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    if (Config.DEV) {
      appState['inDebugMode'] = true
      appState['inDevelMode'] = true
      appState['homePage'] = 'dev-install'
    }

    if (Config.DEV) {
      if (devInstallPageState.appBar) {
        // [TODO] Write logic for power button
      }
      pagesState[get_state_key(devInstallPageState)] = {
        ...devInstallPageState,
        'appBar': {
          ...devInstallPageState,
          'items': [
            ...(devInstallPageState.appBar 
              && devInstallPageState.appBar.items
              || []
            ),
            powerLinkState
          ]
        },
      }
      pagesState[get_state_key(devSignedInAppBar)] = devSignedInAppBar
      pagesState[get_state_key(researchPageState)] = {
        ...researchPageState,
        appBar: {
          ...researchPageAppBarState,
          items: [ 
            defaultErrorsViewLinkState,
            homeLinkState,
            annotationAddFromUrlLinkState,
            powerLinkState
          ]
        }
      }
    }

    if (Config.DEV) {
      const key = get_state_key(devInstallForm)
      formsState[key] = devInstallForm
      const counts = await get_documents_count()
      pagesData[key] = counts
    }

    reply.send({
      state: {
        'app': appState,
        'theme': themeState,
        'appBar': appBarState,
        'pages': pagesState,
        'pagesData': pagesData,
        'background': backgroundState,
        'forms': formsState,
        'dialogs': dialogsState
      },
      meta: {
        'state_registry': Config.getRegistry('state'),
      }
    } as IBootstrapResponse)
  })
}
