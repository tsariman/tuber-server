import {
  TNetState,
  TStateApp,
  TStateAllIcons,
  TStateAppbar,
  TStateAllPages,
  TStateBackground,
  TStateAllForms,
  TStateAllDialogs,
  TO
} from '@tuber/shared'
import {
  bootstrap_pages_dark_state,
  bootstrap_pages_light_state,
  bootstrap_pages_state
} from './page'
import { PrepareState } from '../PrepareState'
import { bootstrap_app_state } from './app'
import bootstrap_theme_state, {
  bootstrap_theme_dark_state,
  bootstrap_theme_light_state
} from './theme'
import { bootstrap_appbar_state } from './appbar'
import { bootstrap_pages_data_state } from './page.data'
import { bootstrap_background_state } from './background'
import {
  bootstrap_forms_dark_state,
  bootstrap_forms_light_state,
  bootstrap_forms_state
} from './form'
import {
  bootstrap_dialogs_dark_state,
  bootstrap_dialogs_light_state,
  bootstrap_dialogs_state
} from './dialog'
import { bootstrap_icons_state } from './icon'
import { ThemeOptions } from '@mui/material'
import { get_registry } from '../../business.logic/registry'
import { IStateContext } from '../_state.common.types'

export default async function get_bootstrap_authenticated_state(
  context: IStateContext
): Promise<TNetState> {
  return {
    'app': new PrepareState<TStateApp>(context).process(
      bootstrap_app_state
    ).get(),
    'theme': new PrepareState<ThemeOptions>(context).process(
      bootstrap_theme_state
    ).get(),
    'themeLight': new PrepareState<ThemeOptions>(context).process(
      bootstrap_theme_light_state
    ).get(),
    'themeDark': new PrepareState<ThemeOptions>(context).process(
      bootstrap_theme_dark_state
    ).get(),
    'appbar': new PrepareState<TStateAppbar>(context).process(
      bootstrap_appbar_state
    ).get(),
    'icons': new PrepareState<TStateAllIcons>(context).process(
      bootstrap_icons_state
    ).get(),
    'pages': new PrepareState<TStateAllPages>(context).process(
      bootstrap_pages_state
    ).get(),
    'pagesLight': new PrepareState<TStateAllPages>(context).process(
      bootstrap_pages_light_state
    ).get(),
    'pagesDark': new PrepareState<TStateAllPages>(context).process(
      bootstrap_pages_dark_state
    ).get(),
    'pagesData': (await new PrepareState(context).processAsync(
      bootstrap_pages_data_state
    )).get() as TO,
    'background': new PrepareState<TStateBackground>(context).process(
      bootstrap_background_state
    ).get(),
    'forms': new PrepareState<TStateAllForms>(context).process(
      bootstrap_forms_state
    ).get(),
    'formsLight': new PrepareState<TStateAllForms>(context).process(
      bootstrap_forms_light_state
    ).get(),
    'formsDark': new PrepareState<TStateAllForms>(context).process(
      bootstrap_forms_dark_state
    ).get(),
    'dialogs': new PrepareState<TStateAllDialogs>(context).process(
      bootstrap_dialogs_state
    ).get(),
    'dialogsLight': new PrepareState<TStateAllDialogs>(context).process(
      bootstrap_dialogs_light_state
    ).get(),
    'dialogsDark': new PrepareState<TStateAllDialogs>(context).process(
      bootstrap_dialogs_dark_state
    ).get(),
    'staticRegistry': get_registry('state'),
    ...(context.usr && { 'net': {
      'name': context.usr.name,
      'role': context.usr.role,
      '_id': context.usr._id.toString(),
    }}),
  }
}