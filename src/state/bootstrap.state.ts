import Config from '../config';
import {
  TNetState,
  TStateApp,
  TThemeMode
} from '../common.types';
import {
  $40_STATE_KEY,
  $44_STATE_KEY,
} from '../constants';
import {
  bootstrap_dialogs_dark_state,
  bootstrap_dialogs_light_state,
  bootstrap_dialogs_state,
} from './dialog';
import { TCipheredUser } from '../schema/users';
import get_theme_state, {
  darkThemeState,
  lightThemeState
} from './theme.state';
import { bootstrap_default_appbar_state } from './default.content';
import { bootstrap_background_state } from '.';
import bootstrap_pages_data_state from './pages.data.state';
import {
  bootstrap_forms_dark_state,
  bootstrap_forms_light_state,
  bootstrap_forms_state
} from './form';
import {
  bootstrap_pages_dark_state,
  bootstrap_pages_light_state,
  bootstrap_pages_state
} from './page';

/**
 * Get the default state app.
 *
 * @returns app state
 */
function _get_default_app_info(
  usr?: TCipheredUser,
  mode?: TThemeMode
): TStateApp {
  const inDev = Config.DEV && !!usr && usr.role === 'developer';
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
  };
}

export interface IBootstrap {
  token?: string;
  usr?: TCipheredUser;
  mode?: TThemeMode;
}

export default async function get_bootstrap_state(
  bootstrap: IBootstrap
): Promise<TNetState> {
  const { usr, mode, token } = bootstrap;
  return {
    'app': _get_default_app_info(usr, mode),
    'theme': get_theme_state(mode),
    'themeLight': lightThemeState,
    'themeDark': darkThemeState,
    'appbar': bootstrap_default_appbar_state(),
    'pages': bootstrap_pages_state(usr, mode),
    'pagesLight': bootstrap_pages_light_state(usr),
    'pagesDark': bootstrap_pages_dark_state(usr),
    'pagesData': await bootstrap_pages_data_state(),
    'background': bootstrap_background_state(),
    'forms': bootstrap_forms_state(usr, mode),
    'formsLight': bootstrap_forms_light_state(usr),
    'formsDark': bootstrap_forms_dark_state(usr),
    'dialogs': bootstrap_dialogs_state(mode),
    'dialogsLight': bootstrap_dialogs_light_state(),
    'dialogsDark': bootstrap_dialogs_dark_state(),
    'stateRegistry': Config.getRegistry('state'),
    ...(usr && { 'net': {
      'name': usr.name,
      'role': usr.role,
      'token': token,
      'jwt_version': usr.jwt_version
    }}),
  };
}