import type {
  TNetState,
  TO,
  TStateAllDialogs,
  TStateAllForms,
  TStateAllIcons,
  TStateAllPages,
  TStateApp,
  TStateAppbar,
  TStateBackground,
} from '@tuber/shared'
import { EP_BOOKMARKS } from '@tuber/shared'
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
import { get_registry } from '../../business.logic/registry'
import { IStateContext } from '../_state.common.types'
import STATE_KEY from '../../business.logic/state.key'
import { TSearchMode } from '../../common.types'
import { ThemeOptions } from '@mui/material'

const $40 = STATE_KEY['40']
const VALID_SEARCH_MODE: TSearchMode[] = ['public', 'private', 'all']
const SEARCH_ICON: Record<TSearchMode, string> = {
  public: 'public_outline',
  private: 'lock',
  all: 'user_circle'
}
const SEARCH_PLACEHOLDER: Record<TSearchMode, string> = {
  public: 'Search public bookmarks…',
  private: 'Search your bookmarks…',
  all: 'Search all bookmarks…'
}

interface IPostAuthContinuityIntent {
  searchMode?: TSearchMode
  playerOpen?: boolean
}

const parse_post_auth_continuity_intent = (query?: string): IPostAuthContinuityIntent => {
  if (typeof query !== 'string' || !query.trim()) {
    return {}
  }

  const normalized = query.startsWith('?') ? query.substring(1) : query
  const params = new URLSearchParams(normalized)
  const rawSearchMode = params.get('filter[search_mode]') || params.get('filter[mode]')
  const rawPlayerOpen = params.get('filter[player_open]')

  const searchMode = VALID_SEARCH_MODE.includes(rawSearchMode as TSearchMode)
    ? rawSearchMode as TSearchMode
    : undefined
  const playerOpen = rawPlayerOpen === 'true'
    ? true
    : rawPlayerOpen === 'false'
      ? false
      : undefined

  return {
    searchMode,
    playerOpen
  }
}

export default async function get_bootstrap_authenticated_state(
  context: IStateContext
): Promise<TNetState> {
  const state: TNetState = {
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

  const continuity = parse_post_auth_continuity_intent(context.query)
  if (continuity.searchMode || typeof continuity.playerOpen === 'boolean') {
    const pagesData = (state.pagesData || {}) as TO

    if (continuity.searchMode) {
      pagesData[$40] = {
        ...(pagesData[$40] as TO || {}),
        searchMode: continuity.searchMode,
        icon: SEARCH_ICON[continuity.searchMode],
        placeholder: SEARCH_PLACEHOLDER[continuity.searchMode]
      }
    }

    if (typeof continuity.playerOpen === 'boolean') {
      pagesData[EP_BOOKMARKS] = {
        ...(pagesData[EP_BOOKMARKS] as TO || {}),
        playerOpen: continuity.playerOpen
      }
    }

    state.pagesData = pagesData
  }

  return state
}