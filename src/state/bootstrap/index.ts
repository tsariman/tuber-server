import {
  TNetState,
  TStateApp,
  TStateAllIcons,
  TStateAppbar,
  TStateAllPages,
  TStateBackground,
  TStateAllForms,
  TStateAllDialogs
} from '../../shared';
import { TThemeMode, TObj } from '../../common.types';
import { TCipheredUser } from '../../schema/users';
import {
  bootstrap_pages_dark_state,
  bootstrap_pages_light_state,
  bootstrap_pages_state
} from './page';
import { PrepareState } from '../PrepareState';
import { IStateContext } from '../_state.common.types';
import { bootstrap_app_state } from './app';
import bootstrap_theme_state, {
  bootstrap_theme_dark_state,
  bootstrap_theme_light_state
} from './theme';
import { bootstrap_appbar_state } from './appbar';
import { bootstrap_pages_data_state } from './page.data';
import { bootstrap_background_state } from './background';
import {
  bootstrap_forms_dark_state,
  bootstrap_forms_light_state,
  bootstrap_forms_state
} from './form';
import {
  bootstrap_dialogs_dark_state,
  bootstrap_dialogs_light_state,
  bootstrap_dialogs_state
} from './dialog';
import { bootstrap_icons_state } from './icon';
import { ThemeOptions } from '@mui/material';
import { get_registry } from '../../business.logic/registry';

export interface IBootstrap {
  token?: string;
  usr?: TCipheredUser;
  mode?: TThemeMode;
}

export default async function get_bootstrap_authenticated_state(
  bootstrap: IBootstrap
): Promise<TNetState> {
  const { usr, mode, token } = bootstrap;
  const context: IStateContext = { usr, token, theme: mode };
  return {
    'app': new PrepareState<TStateApp>(context)
                .process(bootstrap_app_state)
                .get(),
    'theme': new PrepareState<ThemeOptions>(context)
                  .process(bootstrap_theme_state)
                  .get(),
    'themeLight': new PrepareState<ThemeOptions>(context)
                  .process(bootstrap_theme_light_state)
                  .get(),
    'themeDark': new PrepareState<ThemeOptions>(context)
                  .process(bootstrap_theme_dark_state)
                  .get(),
    'appbar': new PrepareState<TStateAppbar>(context)
                  .process(bootstrap_appbar_state)
                  .get(),
    'icons': new PrepareState<TStateAllIcons>(context)
              .process(bootstrap_icons_state)
              .get(),
    'pages': new PrepareState<TStateAllPages>(context)
                  .process(bootstrap_pages_state)
                  .get(),
    'pagesLight': new PrepareState<TStateAllPages>(context)
                        .process(bootstrap_pages_light_state)
                        .get(),
    'pagesDark': new PrepareState<TStateAllPages>(context)
                      .process(bootstrap_pages_dark_state)
                      .get(),
    'pagesData': (await new PrepareState(context)
                              .processAsync(bootstrap_pages_data_state))
                              .get() as TObj,
    'background': new PrepareState<TStateBackground>(context)
                        .process(bootstrap_background_state)
                        .get(),
    'forms': new PrepareState<TStateAllForms>(context)
                  .process(bootstrap_forms_state)
                  .get(),
    'formsLight': new PrepareState<TStateAllForms>(context)
                        .process(bootstrap_forms_light_state)
                        .get(),
    'formsDark': new PrepareState<TStateAllForms>(context)
                      .process(bootstrap_forms_dark_state)
                      .get(),
    'dialogs': new PrepareState<TStateAllDialogs>(context)
                    .process(bootstrap_dialogs_state)
                    .get(),
    'dialogsLight': new PrepareState<TStateAllDialogs>(context)
                          .process(bootstrap_dialogs_light_state)
                          .get(),
    'dialogsDark': new PrepareState<TStateAllDialogs>(context)
                          .process(bootstrap_dialogs_dark_state)
                          .get(),
    'staticRegistry': get_registry('state'),
    ...(usr && { 'net': {
      'name': usr.name,
      'role': usr.role,
      'token': token,
      'jwt_version': usr.jwt_version
    }}),
  };
}