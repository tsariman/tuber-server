import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Config from '../config'
import { backgroundState } from '../state'
import {
  // loginDialogState,
  newYoutubeBookmarkDialogState,
  newVideoUrlDialogState,
  editYoutubeBookmarkDialogState,
  deleteBookmarkDialogState,
  clientAlertDialogState
} from '../state/dialog'
import { loginPageState } from '../state/page'
import { defaultAppBarState } from '../state/default.content'
import themeState from '../state/theme.state'
import devInstallPageState from '../DEV/page/dev.install.page.state'
import devSignedInPageState from '../DEV/page/dev.signedin-appbar.page.state'
import devInstallFormState from '../DEV/form/dev.install.form.state'
import researchPageState from '../state/page/research.page.state'
import loginFormState from '../state/form/login.form.state'
import newYouTubeBookmarkFormState from '../state/form/new.youtube.bookmark.form.state'
import researchPageAppBarState from '../state/appBar/research.page.appbar.state'
import {
  homeLinkState,
  bookmarkAddFromUrlLinkState,
  powerLinkState,
  defaultErrorsViewLinkState
} from '../state/nav.link'
import newVideoUrlFormState from '../state/form/new.video.url.form.state'
import { get_state_key, set_state_by_key } from '../business.logic'
import { get_documents_count } from '../DEV'
import editYouTubeBookmarkFormState from '../state/form/edit.youtube.bookmark.form.state'
import {
  IBootstrapResponse,
  TStateAllDialogs,
  TStateAllForms,
  TStateAllPages,
  TStateApp,
  TStateAppBar
} from '../common.types'
import newRumbleBookmarkFormState from '../state/form/new.rumble.bookmark.form.state'
import newRumbleBookmarkDialogState from '../state/dialog/new.rumble.dialog'
import editRumbleBookmarkFormState from '../state/form/edit.rumble.bookmark.form.state'
import editRumbleBookmarkDialogState from '../state/dialog/edit.rumble.dialog'
import newVimeoBookmarkFormState from '../state/form/new.vimeo.bookmark.form.state'
import editVimeoBookmarkFormState from '../state/form/edit.vimeo.bookmark.form.state'
import newVimeoBookmarkDialogState from '../state/dialog/new.vimeo.dialog'
import editVimeoBookmarkDialogState from '../state/dialog/edit.vimeo.dialog'
import newOdyseeBookmarkFormState from '../state/form/new.odysee.bookmark.form.state'
import editOdyseeBookmarkFormState from '../state/form/edit.odysee.bookmark.form.state'
import newDailyBookmarkFormState from '../state/form/new.daily.bookmark.form.state'
import newOdyseeBookmarkDialogState from '../state/dialog/new.odysee.dialog'
import newDailyBookmarkDialogState from '../state/dialog/new.daily.dialog'
import editDailyBookmarkDialogState from '../state/dialog/edit.daily.dialog'
import editOdyseeBookmarkDialogState from '../state/dialog/edit.odysee.dialog'
import newFacebookBookmarkFormState from '../state/form/new.facebook.bookmark.form.state'
import editFacebookBookmarkFormState from '../state/form/edit.facebook.bookmark.form.state'
import newFacebookBookmarkDialogState from '../state/dialog/new.facebook.dialog'
import editFacebookBookmarkDialogState from '../state/dialog/edit.facebook.dialog'
import newUnknownBookmarkFormState from '../state/form/new.unknown.bookmark.form.state'
import editUnknownBookmarkFormState from '../state/form/edit.unknown.bookmark.form.state'
import newUnknownBookmarkDialogState from '../state/dialog/new.unknown.dialog'
import editUnknownBookmarkDialogState from '../state/dialog/edit.unknown.dialog'
import editDailyBookmarkFormState from '../state/form/edit.daily.bookmark.form.state'
import newTwitchBookmarkDialogState from '../state/dialog/new.twitch.dialog'
import editTwitchBookmarkDialogState from '../state/dialog/edit.twitch.dialog'
import newTwitchBookmarkFormState from '../state/form/new.twitch.bookmark.form.state'
import editTwitchBookmarkFormState from '../state/form/edit.twitch.bookmark.form.state'
import devTestThumbnailFormState from 'src/DEV/form/dev.test.thumbnail.form.state'
import { devTestThumbnailPageState } from 'src/DEV/page'
import { $46_KEY } from '../constants'

export default async function bootstrap_controller(fastify: FastifyInstance) {

  /** Application configuration */
  const appState: TStateApp = {
    'fetchingStateAllowed': true,
    'inDebugMode': false,
    'inDevelMode': false,
    'logoUri': '../tuber.png',
    // 'logoWidth': 212,
    // 'logoHeight': 35,
    'title': '[DEV] Tuberesearcher',
    'homePage': 'login',
    'isBootstrapped': true
  }

  const appBarState: TStateAppBar = {
    ...defaultAppBarState
  }

  const pagesState: TStateAllPages = {}
  set_state_by_key(pagesState, loginPageState)
  // TODO: Insert more pages here

  const formsState: TStateAllForms = {}
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

  const dialogsState: TStateAllDialogs = {}
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
  // set_state_by_key(dialogsState, loginDialogState)
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
      set_state_by_key(pagesState, devSignedInPageState)
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
      set_state_by_key(pagesState, devTestThumbnailPageState)
      set_state_by_key(formsState, devTestThumbnailFormState)
      const key = get_state_key(devInstallFormState)
      formsState[key] = devInstallFormState
      const counts = await get_documents_count()
      pagesData[key] = counts
      pagesData[$46_KEY] = {
        thumbnailUrl: `${Config.IMAGE_FOLDER}dev-thumbnail-test-placeholder.jpg`
      }
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
        'dialogs': dialogsState,
        'stateRegistry': Config.getRegistry('state'),
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
