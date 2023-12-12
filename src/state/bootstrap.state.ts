import Config from '../config'
import {
  TNetState,
  TStateAllDialogs,
  TStateAllForms,
  TStateAllPages,
  TStateApp,
  TStateAppBar,
  TStatePage,
  TThemeMode
} from '../common.types'
import {
  $40_STATE_KEY,
  $44_STATE_KEY,
  $46_STATE_KEY,
  $58_STATE_KEY
} from '../constants'
import {
  get_state_key as key,
  set_state_by_key,
  themed
} from '../business.logic'
import researchPageState, { $40DarkThemeMode } from './page/research.page.state'
import signInFormState, { $41DarkThemeMode } from './form/sign.in.form.state'
import {
  $32DarkThemeMode,
  $68DarkThemeMode,
  confirmSignOutDialogState,
  signInDialogState
} from './dialog'
import devInstallPageState, {
  $44DarkThemeMode
} from '../DEV/page/dev.install.page.state'
import researchPageAppBarState, {
  $63DarkThemeMode
} from './appBar/research.page.appbar.state'
import {
  $66DarkThemeMode,
  $67DarkThemeMode,
  bookmarkAddFromUrlLinkState,
  darkModeLinkState,
  defaultErrorsViewLinkState,
  homeLinkState,
  lightModeLinkState,
  powerLogoutLinkState,
  powerSignInLinkState,
  researchAppErrorsViewLinkState
} from './nav.link'
import { TCipheredUser } from '../schema/users'
import get_theme_state, { darkThemeState, lightThemeState } from './theme.state'
import { defaultAppBarState } from './default.content'
import { get_background_state } from '.'
import devInstallFormState, { $47DarkThemeMode } from '../DEV/form/dev.install.form.state'
import { get_documents_count } from 'src/DEV'

/**
 * Get the default state app.
 *
 * @returns app state
 */
function _get_default_app_info(
  usr?: TCipheredUser,
  mode?: TThemeMode
): TStateApp {
  const inDev = Config.DEV && !!usr && usr.role === 'developer'
  return {
    'fetchingStateAllowed': true,
    'inDebugMode': inDev,
    'inDevelMode': inDev,
    'logoUri': '../tuber.png',
    // 'logoWidth': 212,
    // 'logoHeight': 35,
    'title': Config.DEV ? `[DEV] Tuberesearcher` : `Tuberesearcher`,
    'homePage': inDev ? $44_STATE_KEY : $40_STATE_KEY,
    'themeMode': mode,
    'isBootstrapped': true
  }
}

function _get_default_appbar_state(): TStateAppBar {
  return {
    ...defaultAppBarState
  }
}

/**
 * Get the page state for development, testing, and installation.
 *
 * @param list of all pages
 * @param mode theme mode
 * @returns void
 */
function _get_dev_install_page_state(
  usr?: TCipheredUser,
  mode?: TThemeMode
): TStatePage {
  const light = _get_auth_dev_install_page_state(usr)
  const dark = _get_auth_44_dark_theme_mode(usr)
  return themed(light, dark, mode)
}

/**
 * Get the page state development, testing, and installation.
 *
 * @param usr user retrieved from the decode JWT token.
 * @param mode theme mode
 * @returns page state
 */
function _get_auth_dev_install_page_state(usr?: TCipheredUser): TStatePage {
  return {
    ...devInstallPageState,
    'appBar': {
      ...devInstallPageState.appBar,
      'items': [
        ...(devInstallPageState.appBar 
          && devInstallPageState.appBar.items
          || []
        ),
        usr ? powerLogoutLinkState : powerSignInLinkState,
      ]
    },
  }
}

/**
 * [ __Dark themed__ ] page state for development and installation.
 *
 * @param usr user object decode from user token
 * @returns page state
 */
function _get_auth_44_dark_theme_mode (usr?: TCipheredUser): TStatePage {
  return {
    ...$44DarkThemeMode,
    'appBar': {
      ...$44DarkThemeMode.appBar,
      'items': [
        ...($44DarkThemeMode.appBar 
          && $44DarkThemeMode.appBar.items
          || []
        ),
        usr ? $66DarkThemeMode : $67DarkThemeMode,
      ]
    },
  }
}

/**
 * Get the research page state.
 *
 * @param list of all pages
 * @param mode theme mode
 * @returns void
 */
function _get_research_page_state(
  usr?: TCipheredUser,
  mode?: TThemeMode
): TStatePage {
  const light = _get_auth_research_page_state(usr)
  const dark = _get_auth_40_dark_theme_mode(usr)
  return themed(light, dark, mode)
}

/**
 * Research page state.
 *
 * @param usr User data from the decoded token.
 * @param mode theme mode
 * @returns state page
 */
function _get_auth_research_page_state(
  usr?: TCipheredUser
): TStatePage {
  return {
    ...researchPageState,
    appBar: {
      ...researchPageAppBarState,
      items: [
        defaultErrorsViewLinkState,
        homeLinkState,
        bookmarkAddFromUrlLinkState,
        lightModeLinkState,
        usr ? powerLogoutLinkState : powerSignInLinkState,
      ]
    }
  }
}

/**
 * Dark theme mode variant for research page state.
 *
 * @param usr user object retrieve from the decoded token.
 * @param mode theme mode
 * @returns page state
 */
function _get_auth_40_dark_theme_mode(usr?: TCipheredUser): TStatePage {
  return {
    ...$40DarkThemeMode,
    appBar: {
      ...$63DarkThemeMode,
      items: [
        researchAppErrorsViewLinkState,
        homeLinkState,
        bookmarkAddFromUrlLinkState,
        darkModeLinkState,
        usr ? $66DarkThemeMode : $67DarkThemeMode,
      ]
    }
  }
}

function _get_dev_install_form_state(mode?: TThemeMode) {
  return themed(
    devInstallFormState,
    $47DarkThemeMode,
    mode
  )
}

/**
 * Get the sign in form state.
 *
 * @param list of all forms
 * @param mode theme mode
 * @returns void
 */
function _get_signin_form_state(mode?: TThemeMode) {
  return themed(
    signInFormState,
    $41DarkThemeMode,
    mode
  )
}

/**
 * Get the dialog state to sign in.
 *
 * @param list of all dialogs
 * @param mode theme mode
 * @returns void
 */
function _get_signin_dialog_state(mode?: TThemeMode) {
  return themed(
    signInDialogState,
    $32DarkThemeMode,
    mode
  )
}

/**
 * Sign out dialog state.
 *
 * @param list of all dialogs
 * @param mode theme mode
 * @returns void
 */
function _get_signout_dialog_state (mode?: TThemeMode) {
  return themed(
    confirmSignOutDialogState,
    $68DarkThemeMode,
    mode
  )
}

function _get_pages_state(
  usr?: TCipheredUser,
  mode?: TThemeMode
): TStateAllPages {
  const pages: TStateAllPages = {}
  pages[key(researchPageState)] = _get_research_page_state(usr, mode)
  if (Config.DEV && usr && usr.role === 'developer') {
    pages[key(devInstallPageState)] = _get_dev_install_page_state(usr, mode)
  }
  return pages
}

function _get_pages_light_state(usr?: TCipheredUser): TStateAllPages {
  const pages: TStateAllPages = {}
  set_state_by_key(pages, _get_auth_research_page_state(usr))
  if (Config.DEV && usr && usr.role === 'developer') {
    pages[key(devInstallPageState)] = _get_auth_dev_install_page_state(usr)
  }
  // TODO: Don't forget to insert light mode state for each page

  return pages
}

function _get_pages_dark_state(usr?: TCipheredUser): TStateAllPages {
  const pages: TStateAllPages = {}
  set_state_by_key(pages, _get_auth_40_dark_theme_mode(usr))
  if (Config.DEV && usr && usr.role==='developer') {
    pages[key(devInstallPageState)] = _get_auth_44_dark_theme_mode(usr)
  }
  // TODO: Don't forget to insert dark mode state for each page

  return pages
}

async function _get_pages_data(): Promise<TStateAllPages> {
  const pagesData: Record<string, any> = {}
  const counts = await get_documents_count()
  pagesData[key(devInstallFormState)] = counts
  pagesData[$46_STATE_KEY] = {
    thumbnailUrl: `${Config.IMAGE_FOLDER}dev-thumbnail-test-placeholder.jpg`
  }
  pagesData[$58_STATE_KEY] = {
    thumbnailUrl: `${Config.IMAGE_FOLDER}dev-thumbnail-test-placeholder.jpg`
  }
  return pagesData
}

function _get_forms_state(usr?: TCipheredUser, mode?: TThemeMode): TStateAllForms {
  const forms: TStateAllForms = {}
  forms[key(signInFormState)] = _get_signin_form_state(mode)
  if (Config.DEV && usr && usr.role === 'developer') {
    forms[key(devInstallFormState)] = _get_dev_install_form_state(mode)
  }
  // TODO Insert your new form here if you want it to be load in the
  //      bootstrapping process.

  return forms
}

function _get_forms_light_state(usr?: TCipheredUser) {
  const forms: TStateAllForms = {}
  set_state_by_key(forms, signInFormState)
  if (Config.DEV && usr && usr.role === 'developer') {
    forms[key(devInstallFormState)] = devInstallFormState
  }
  // TODO: Don't forget to insert light mode version of each form state.
  //       Note: The light mode is the original version.

  return forms
}

function _get_forms_dark_state(usr?: TCipheredUser) {
  const forms: TStateAllForms = {}
  set_state_by_key(forms, $41DarkThemeMode)
  if (Config.DEV && usr && usr.role === 'developer') {
    forms[key(devInstallFormState)] = $47DarkThemeMode
  }
  // TODO: Don't forget to insert dark mode version of each form state.

  return forms
}

/**
 * Dialogs
 *
 * @param mode 
 * @returns dialogs
 */
function _get_dialogs_state(mode?: TThemeMode) {
  const dialogs: TStateAllDialogs = {}
  dialogs[key(signInDialogState)] = _get_signin_dialog_state(mode)
  dialogs[key(confirmSignOutDialogState)] = _get_signout_dialog_state(mode)

  // TODO Insert your new dialog here if you want it to be load in the
  //      bootstrapping process.

  return dialogs
}

function _get_dialogs_light_state() {
  const dialogs: TStateAllDialogs = {}
  set_state_by_key(dialogs, signInDialogState)
  set_state_by_key(dialogs, confirmSignOutDialogState)
  // TODO: Don't forget to insert light mode state for each dialog

  return dialogs
}

function _get_dialogs_dark_state() {
  const dialogs: TStateAllDialogs = {}
  set_state_by_key(dialogs, $32DarkThemeMode)
  set_state_by_key(dialogs, $68DarkThemeMode)
  // TODO: Don't forget to insert dark mode state for each dialog

  return dialogs
}

export interface IBootstrap {
  token?: string
  usr?: TCipheredUser
  mode?: TThemeMode
}

export default async function get_bootstrap_state(
  bootstrap: IBootstrap
): Promise<TNetState> {
  const { usr, mode, token } = bootstrap
  return {
    'app': _get_default_app_info(usr, mode),
    'theme': get_theme_state(),
    'themeLight': lightThemeState,
    'themeDark': darkThemeState,
    'appBar': _get_default_appbar_state(),
    'pages': _get_pages_state(usr, mode),
    'pagesLight': _get_pages_light_state(usr),
    'pagesDark': _get_pages_dark_state(usr),
    'pagesData': await _get_pages_data(),
    'background': get_background_state(),
    'forms': _get_forms_state(usr, mode),
    'formsLight': _get_forms_light_state(usr),
    'formsDark': _get_forms_dark_state(usr),
    'dialogs': _get_dialogs_state(mode),
    'dialogsLight': _get_dialogs_light_state(),
    'dialogsDark': _get_dialogs_dark_state(),
    'stateRegistry': Config.getRegistry('state'),
    ...(usr && { 'session': {
      'name': usr.name,
      'role': usr.role,
      'token': token,
      'jwt_version': usr.jwt_version
    }}),
  }
}