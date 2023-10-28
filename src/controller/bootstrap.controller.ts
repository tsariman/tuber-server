import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Config from '../config'
import IStateApp from '../../../tuber-client/src/controllers/interfaces/IStateApp'
import { backgroundState } from '../state'
import {
  loginDialogState,
  newYoutubeBookmarkDialogState,
  newVideoUrlDialogState,
  editYoutubeBookmarkDialogState,
  deleteBookmarkDialogState,
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
import newYouTubeBookmarkFormState from '../state/forms/new.youtube.bookmark.form.state'
import researchPageAppBarState from '../state/appBar/research.page.appbar.state'
import {
  homeLinkState,
  bookmarkAddFromUrlLinkState,
  powerLinkState,
  defaultErrorsViewLinkState
} from '../state/nav.link'
import newVideoUrlFormState from '../state/forms/new.video.url.form.state'
import { get_state_key, set_state_by_key } from '../business.logic'
import { get_documents_count } from '../INSTALL.DEV'
import editYouTubeBookmarkFormState from '../state/forms/edit.youtube.bookmark.form.state'
import { IBootstrapResponse } from '../business.logic/common.types'
import newRumbleBookmarkFormState from '../state/forms/new.rumble.bookmark.form.state'
import newRumbleBookmarkDialogState from '../state/dialogs/new.rumble.dialog'
import editRumbleBookmarkFormState from '../state/forms/edit.rumble.bookmark.form.state'
import editRumbleBookmarkDialogState from '../state/dialogs/edit.rumble.dialog'
import newVimeoBookmarkFormState from '../state/forms/new.vimeo.bookmark.form.state'
import editVimeoBookmarkFormState from '../state/forms/edit.vimeo.bookmark.form.state'
import newVimeoBookmarkDialogState from '../state/dialogs/new.vimeo.dialog'
import editVimeoBookmarkDialogState from '../state/dialogs/edit.vimeo.dialog'
import newOdyseeBookmarkFormState from '../state/forms/new.odysee.bookmark.form.state'
import editOdyseeBookmarkFormState from '../state/forms/edit.odysee.bookmark.form.state'
import newDailyBookmarkFormState from '../state/forms/new.daily.bookmark.form.state'
import newOdyseeBookmarkDialogState from '../state/dialogs/new.odysee.dialog'
import newDailyBookmarkDialogState from '../state/dialogs/new.daily.dialog'
import editDailyBookmarkDialogState from '../state/dialogs/edit.daily.dialog'
import editOdyseeBookmarkDialogState from '../state/dialogs/edit.odysee.dialog'
import newFacebookBookmarkFormState from '../state/forms/new.facebook.bookmark.form.state'
import editFacebookBookmarkFormState from '../state/forms/edit.facebook.bookmark.form.state'
import newFacebookBookmarkDialogState from '../state/dialogs/new.facebook.dialog'
import editFacebookBookmarkDialogState from '../state/dialogs/edit.facebook.dialog'
import newUnknownBookmarkFormState from '../state/forms/new.unknown.bookmark.form.state'
import editUnknownBookmarkFormState from '../state/forms/edit.unknown.bookmark.form.state'
import newUnknownBookmarkDialogState from '../state/dialogs/new.unknown.dialog'
import editUnknownBookmarkDialogState from '../state/dialogs/edit.unknown.dialog'
import editDailyBookmarkFormState from '../state/forms/edit.daily.bookmark.form.state'
import newTwitchBookmarkDialogState from 'src/state/dialogs/new.twitch.dialog'
import editTwitchBookmarkDialogState from 'src/state/dialogs/edit.twitch.dialog'
import newTwitchBookmarkFormState from 'src/state/forms/new.twitch.bookmark.form.state'
import editTwitchBookmarkFormState from 'src/state/forms/edit.twitch.bookmark.form.state'

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
  set_state_by_key(formsState, newYouTubeBookmarkFormState)
  set_state_by_key(formsState, newRumbleBookmarkFormState)
  set_state_by_key(formsState, editYouTubeBookmarkFormState)
  set_state_by_key(formsState, editRumbleBookmarkFormState)
  set_state_by_key(formsState, newVimeoBookmarkFormState)
  set_state_by_key(formsState, editVimeoBookmarkFormState)
  set_state_by_key(formsState, newOdyseeBookmarkFormState)
  set_state_by_key(formsState, editOdyseeBookmarkFormState)
  set_state_by_key(formsState, newDailyBookmarkFormState)
  set_state_by_key(formsState, editDailyBookmarkFormState)
  set_state_by_key(formsState, newFacebookBookmarkFormState)
  set_state_by_key(formsState, editFacebookBookmarkFormState)
  set_state_by_key(formsState, newUnknownBookmarkFormState)
  set_state_by_key(formsState, editUnknownBookmarkFormState)
  set_state_by_key(formsState, newTwitchBookmarkFormState)
  set_state_by_key(formsState, editTwitchBookmarkFormState)
  set_state_by_key(formsState, newVideoUrlFormState)
  // TODO: Insert more forms here

  const dialogsState: IStateAllDialogs = {}
  set_state_by_key(dialogsState, newYoutubeBookmarkDialogState)
  set_state_by_key(dialogsState, newRumbleBookmarkDialogState)
  set_state_by_key(dialogsState, editYoutubeBookmarkDialogState)
  set_state_by_key(dialogsState, editRumbleBookmarkDialogState)
  set_state_by_key(dialogsState, newVimeoBookmarkDialogState)
  set_state_by_key(dialogsState, editVimeoBookmarkDialogState)
  set_state_by_key(dialogsState, newOdyseeBookmarkDialogState)
  set_state_by_key(dialogsState, editOdyseeBookmarkDialogState)
  set_state_by_key(dialogsState, newDailyBookmarkDialogState)
  set_state_by_key(dialogsState, editDailyBookmarkDialogState)
  set_state_by_key(dialogsState, newFacebookBookmarkDialogState)
  set_state_by_key(dialogsState, editFacebookBookmarkDialogState)
  set_state_by_key(dialogsState, newTwitchBookmarkDialogState)
  set_state_by_key(dialogsState, editTwitchBookmarkDialogState)
  set_state_by_key(dialogsState, newUnknownBookmarkDialogState)
  set_state_by_key(dialogsState, editUnknownBookmarkDialogState)
  set_state_by_key(dialogsState, loginDialogState)
  set_state_by_key(dialogsState, newVideoUrlDialogState)
  set_state_by_key(dialogsState, deleteBookmarkDialogState)
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
            bookmarkAddFromUrlLinkState,
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

  fastify.post('/2', async function (
    _req: FastifyRequest,
    reply: FastifyReply
  ) {
    reply.send({
      state: { 'dialog': newVideoUrlDialogState }
    })
  })
}
