import { ThemeOptions } from '@mui/material';
import {
  TNetState,
  TStateApp,
  TStateAllIcons,
  TThemeMode,
  TStateAppbar,
  TStateAllPages,
  TObj,
  TStateBackground,
  TStateAllForms,
  TStateAllDialogs
} from '../common.types';
import { TCipheredUser } from '../schema/users';
import {
  bootstrap_pages_dark_state,
  bootstrap_pages_light_state,
  bootstrap_pages_state
} from './bootstrap/page';
import { PrepareState } from './PrepareState';
import { IStateContext } from './_state.common.types';
import { bootstrap_app_state } from './bootstrap/app';
import bootstrap_theme_state, {
  bootstrap_theme_dark_state,
  bootstrap_theme_light_state
} from './bootstrap/theme';
import { bootstrap_appbar_state } from './bootstrap/appbar';
import { bootstrap_pages_data_state } from './bootstrap/page.data';
import { bootstrap_background_state } from './bootstrap/background';
import {
  bootstrap_forms_dark_state,
  bootstrap_forms_light_state,
  bootstrap_forms_state
} from './bootstrap/form';
import {
  bootstrap_dialogs_dark_state,
  bootstrap_dialogs_light_state,
  bootstrap_dialogs_state
} from './bootstrap/dialog';
import { bootstrap_icons_state } from './bootstrap/icon';
import { get_registry } from '../business.logic/registry';

export interface IBootstrap {
  token?: string;
  usr?: TCipheredUser;
  mode?: TThemeMode;
}

/** @deprecated */
export default async function get_bootstrap_authenticated_state(
  bootstrap: IBootstrap
): Promise<TNetState> {
  const { usr, mode, token } = bootstrap;
  const context: IStateContext = { usr, token, theme: mode };
  return {
    // 'app': _get_default_app_info(usr, mode),
    'app': new PrepareState<TStateApp>(context)
                .process(bootstrap_app_state)
                .get(),
    // 'theme': get_theme_state(mode),
    'theme': new PrepareState<ThemeOptions>(context)
                  .process(bootstrap_theme_state)
                  .get(),
    // 'themeLight': lightThemeState,
    'themeLight': new PrepareState<ThemeOptions>(context)
                  .process(bootstrap_theme_light_state)
                  .get(),
    // 'themeDark': darkThemeState,
    'themeDark': new PrepareState<ThemeOptions>(context)
                  .process(bootstrap_theme_dark_state)
                  .get(),
    // 'appbar': bootstrap_default_appbar_state(),
    'appbar': new PrepareState<TStateAppbar>(context)
                  .process(bootstrap_appbar_state)
                  .get(),
    'icons': new PrepareState<TStateAllIcons>(context)
              .process(bootstrap_icons_state)
              .get(),
    // 'pages': bootstrap_pages_state(usr, mode),
    'pages': new PrepareState<TStateAllPages>(context)
                  .process(bootstrap_pages_state)
                  .get(),
    // 'pagesLight': bootstrap_pages_light_state(usr),
    'pagesLight': new PrepareState<TStateAllPages>(context)
                        .process(bootstrap_pages_light_state)
                        .get(),
    // 'pagesDark': bootstrap_pages_dark_state(usr),
    'pagesDark': new PrepareState<TStateAllPages>(context)
                      .process(bootstrap_pages_dark_state)
                      .get(),
    // 'pagesData': await bootstrap_pages_data_state(usr),
    'pagesData': (await new PrepareState(context)
                              .processAsync(bootstrap_pages_data_state))
                              .get() as TObj,
    //'background': bootstrap_background_state(),
    'background': new PrepareState<TStateBackground>(context)
                        .process(bootstrap_background_state)
                        .get(),
    // 'forms': bootstrap_forms_state(usr, mode),
    'forms': new PrepareState<TStateAllForms>(context)
                  .process(bootstrap_forms_state)
                  .get(),
    // 'formsLight': bootstrap_forms_light_state(usr),
    'formsLight': new PrepareState<TStateAllForms>(context)
                        .process(bootstrap_forms_light_state)
                        .get(),
    // 'formsDark': bootstrap_forms_dark_state(usr),
    'formsDark': new PrepareState<TStateAllForms>(context)
                      .process(bootstrap_forms_dark_state)
                      .get(),
    // 'dialogs': bootstrap_dialogs_state(mode),
    'dialogs': new PrepareState<TStateAllDialogs>(context)
                    .process(bootstrap_dialogs_state)
                    .get(),
    // 'dialogsLight': bootstrap_dialogs_light_state(),
    'dialogsLight': new PrepareState<TStateAllDialogs>(context)
                          .process(bootstrap_dialogs_light_state)
                          .get(),
    // 'dialogsDark': bootstrap_dialogs_dark_state(),
    'dialogsDark': new PrepareState<TStateAllDialogs>(context)
                          .process(bootstrap_dialogs_dark_state)
                          .get(),
    'stateRegistry': get_registry('state'),
    ...(usr && { 'net': {
      'name': usr.name,
      'role': usr.role,
      'token': token,
      'jwt_version': usr.jwt_version
    }}),
  };
}