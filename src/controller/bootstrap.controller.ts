import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Config from '../config'
import { backgroundState } from '../state'
import { newVideoUrlDialogState } from '../state/dialog'
import { defaultAppBarState } from '../state/default.content'
import themeState from '../state/theme.state'
import devInstallPageState from '../DEV/page/dev.install.page.state'
import devInstallFormState from '../DEV/form/dev.install.form.state'
import researchPageState from '../state/page/research.page.state'
import researchPageAppBarState from '../state/appBar/research.page.appbar.state'
import {
  homeLinkState,
  bookmarkAddFromUrlLinkState,
  powerLinkState,
  defaultErrorsViewLinkState
} from '../state/nav.link'
import { get_state_key } from '../business.logic'
import { get_documents_count } from '../DEV'
import {
  IBootstrapResponse,
  TStateAllDialogs,
  TStateAllForms,
  TStateAllPages,
  TStateApp,
  TStateAppBar
} from '../common.types'
import { $46_KEY, $58_KEY } from '../constants'

export default async function bootstrap_controller(fastify: FastifyInstance) {

  /** Application information state */
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
  // set_state_by_key(pagesState, loginPageState)
  // TODO: Insert more pages here

  const formsState: TStateAllForms = {}
  // set_state_by_key(formsState, loginFormState)
  // TODO: Insert more forms here

  const dialogsState: TStateAllDialogs = {}
  // set_state_by_key(dialogsState, loginDialogState)
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
      const key = get_state_key(devInstallFormState)
      formsState[key] = devInstallFormState
      const counts = await get_documents_count()
      pagesData[key] = counts
      pagesData[$46_KEY] = {
        thumbnailUrl: `${Config.IMAGE_FOLDER}dev-thumbnail-test-placeholder.jpg`
      }
      pagesData[$58_KEY] = {
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
