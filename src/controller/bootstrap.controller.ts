import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import Config from '../config'
import { backgroundState } from '../state'
import { newVideoUrlDialogState } from '../state/dialog'
import { defaultAppBarState } from '../state/default.content'
import get_theme_state, {
  darkThemeState,
  lightThemeState
} from '../state/theme.state'
import devInstallPageState, {
  $44DarkThemeMode
} from '../DEV/page/dev.install.page.state'
import devInstallFormState, {
  $47DarkThemeMode
} from '../DEV/form/dev.install.form.state'
import researchPageState, {
  $40DarkThemeMode
} from '../state/page/research.page.state'
import researchPageAppBarState, {
  $63DarkThemeMode
} from '../state/appBar/research.page.appbar.state'
import {
  homeLinkState,
  bookmarkAddFromUrlLinkState,
  powerLinkState,
  defaultErrorsViewLinkState,
  lightModeLinkState,
  darkModeLinkState
} from '../state/nav.link'
import { get_state_key, themed } from '../business.logic'
import { get_documents_count } from '../DEV'
import {
  IBootstrapResponse,
  TStateAllDialogs,
  TStateAllForms,
  TStateAllPages,
  TStateApp,
  TStateAppBar,
} from '../common.types'
import {
  $46_STATE_KEY,
  $58_STATE_KEY,
  THEME_MODE
} from '../constants'

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
    'isBootstrapped': true,
  }

  const appBarState: TStateAppBar = {
    ...defaultAppBarState
  }

  const pagesState: TStateAllPages = {}
  // set_state_by_key(pagesState, loginPageState)
  // TODO: Insert more pages here

  const pagesLightState: TStateAllPages = {}
  const pagesDarkState: TStateAllPages = {}

  const formsState: TStateAllForms = {}
  // set_state_by_key(formsState, loginFormState)
  // TODO: Insert more forms here

  const formsLightState: TStateAllForms = {}
  const formsDarkState: TStateAllForms = {}

  const dialogsState: TStateAllDialogs = {}
  // set_state_by_key(dialogsState, loginDialogState)
  // TODO: Insert more dialogs here

  const dialogsLightState: TStateAllDialogs = {}
  const dialogsDarkState: TStateAllDialogs = {}

  const pagesData = {} as { [key: string]: any }

  fastify.post('/', async function (
    _request: FastifyRequest,
    reply: FastifyReply
  ) {
    // [TODO] Read theme mode from user settings if user is logged in
    const mode = appState['themeMode'] = Config.read(THEME_MODE, 'light')
    if (Config.DEV) {
      appState['inDebugMode'] = true
      appState['inDevelMode'] = true
      appState['homePage'] = 'dev-install'
      if (devInstallPageState.appBar) {
        // [TODO] Write logic for power button
      }
      const devInstallPageKey = get_state_key(devInstallPageState)
      pagesLightState[devInstallPageKey] = {
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
      pagesDarkState[devInstallPageKey] = {
        ...$44DarkThemeMode,
        'appBar': {
          ...$44DarkThemeMode,
          'items': [
            ...($44DarkThemeMode.appBar 
              && $44DarkThemeMode.appBar.items
              || []
            ),
            powerLinkState
          ]
        },
      }

      // Dev install page state
      pagesState[devInstallPageKey] = themed(
        pagesLightState[devInstallPageKey],
        pagesDarkState[devInstallPageKey],
        mode
      )

      const researchPageKey = get_state_key(researchPageState)

      // Research page light mode state
      pagesLightState[researchPageKey] = {
        ...researchPageState,
        appBar: {
          ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
          items: [
            defaultErrorsViewLinkState,
            homeLinkState,
            bookmarkAddFromUrlLinkState,
            lightModeLinkState,
            powerLinkState
          ]
        }
      }

      // Research page dark mode state
      pagesDarkState[researchPageKey] = {
        ...$40DarkThemeMode,
        appBar: {
          ...themed(researchPageAppBarState, $63DarkThemeMode, mode),
          items: [
            defaultErrorsViewLinkState,
            homeLinkState,
            bookmarkAddFromUrlLinkState,
            darkModeLinkState,
            powerLinkState
          ]
        }
      }

      // Research page state
      pagesState[researchPageKey] = themed(
        pagesLightState[researchPageKey],
        pagesDarkState[researchPageKey],
        mode
      )
      const formState = themed(devInstallFormState, $47DarkThemeMode, mode)
      const devInstallFormKey = get_state_key(formState)
      formsState[devInstallFormKey] = formState
      formsLightState[devInstallFormKey] = devInstallFormState
      formsDarkState[devInstallFormKey] = $47DarkThemeMode
      const counts = await get_documents_count()
      pagesData[devInstallFormKey] = counts
      pagesData[$46_STATE_KEY] = {
        thumbnailUrl: `${Config.IMAGE_FOLDER}dev-thumbnail-test-placeholder.jpg`
      }
      pagesData[$58_STATE_KEY] = {
        thumbnailUrl: `${Config.IMAGE_FOLDER}dev-thumbnail-test-placeholder.jpg`
      }
    }

    reply.send({
      state: {
        'app': appState,
        'theme': get_theme_state(),
        'themeLight': lightThemeState,
        'themeDark': darkThemeState,
        'appBar': appBarState,
        'pages': pagesState,
        'pagesLight': pagesLightState,
        'pagesDark': pagesDarkState,
        'pagesData': pagesData,
        'background': backgroundState,
        'forms': formsState,
        'formsLight': formsLightState,
        'formsDark': formsDarkState,
        'dialogs': dialogsState,
        'dialogsLight': dialogsLightState,
        'dialogsDark': dialogsDarkState,
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
