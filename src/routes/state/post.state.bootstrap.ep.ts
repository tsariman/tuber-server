import { FastifyReply, FastifyRequest } from 'fastify'
import { IStateContext } from '../../state/_state.common.types'
import { PrepareState } from '../../state/PrepareState'
import { bootstrap_app_state } from '../../state/bootstrap/app'
import bootstrap_theme_state, {
  bootstrap_theme_dark_state,
  bootstrap_theme_light_state
} from '../../state/bootstrap/theme'
import { bootstrap_appbar_state } from '../../state/bootstrap/appbar'
import { TJsonapiStateResponse, TStateAllIcons } from '@tuber/shared'
import { bootstrap_icons_state } from '../../state/bootstrap/icon'
import {
  bootstrap_pages_dark_state,
  bootstrap_pages_light_state,
  bootstrap_pages_state
} from '../../state/bootstrap/page'
import { bootstrap_pages_data_state } from '../../state/bootstrap/page.data'
import { bootstrap_background_state } from '../../state/bootstrap/background'
import {
  bootstrap_forms_dark_state,
  bootstrap_forms_light_state,
  bootstrap_forms_state
} from '../../state/bootstrap/form'
import {
  bootstrap_dialogs_dark_state,
  bootstrap_dialogs_light_state,
  bootstrap_dialogs_state
} from '../../state/bootstrap/dialog'
import { get_registry } from '../../business.logic/registry'
import { log_err } from '../../utility/logging'
import { error_id } from '../../business.logic/errors'
import { EP_BOOKMARKS, TJsonapiResponseResource, TStateDialog } from '@tuber/shared'
import { visitorAlertDialogState } from '../../state/dialog'
import STATE_KEY from '../../business.logic/state.key'
import {
  read_bookmark_collection_by_query,
  read_bookmark_votes_for_user,
  resolve_bookmark_page_by_query,
  to_jsonapi_bookmark_resources,
} from '../../model/bookmark'
import { TSearchMode } from '../../common.types'
import Config from '../../config'
import JsonapiPaginationBuilder, { get_pagination_options } from '../../business.logic/builder/JsonapiPaginationBuilder'

const $40 = STATE_KEY['40']
const VALID_SEARCH_MODE: TSearchMode[] = ['public', 'private', 'all']
const SEARCH_PLACEHOLDER: Record<TSearchMode, string> = {
  public: 'Search public bookmarks…',
  private: 'Search your bookmarks…',
  all: 'Search all bookmarks…'
}
const SEARCH_ICON: Record<TSearchMode, string> = {
  public: 'public_outline',
  private: 'lock',
  all: 'user_circle'
}

interface IBootstrapFilterQuery {
  search?: string
  mode?: string
  search_mode?: string
  player_open?: string
  show_thumbnail?: string
  playing_bookmark_key?: string
  playing_bookmark_page?: string
}

interface IBootstrapQuery {
  filter?: IBootstrapFilterQuery
  page?: {
    number?: number
    size?: number
  }
}

const to_bool_or_undefined = (value?: string): boolean | undefined => {
  if (value === 'true') return true
  if (value === 'false') return false
  return undefined
}

const to_valid_search_mode = (mode?: string): TSearchMode | undefined => {
  if (!mode) {
    return undefined
  }
  if (VALID_SEARCH_MODE.includes(mode as TSearchMode)) {
    return mode as TSearchMode
  }
  return undefined
}

const get_effective_search_mode = (
  parsedMode: TSearchMode | undefined,
  isAuthenticated: boolean
): TSearchMode => {
  if (!isAuthenticated) {
    return 'public'
  }
  return parsedMode || 'private'
}

const to_valid_search_query = (query?: string): string | undefined => {
  if (!query) {
    return undefined
  }
  const trimmed = query.trim()
  if (!trimmed || trimmed.length > 255) {
    return undefined
  }
  return trimmed
}

const to_optional_string = (value: unknown): string | undefined => {
  if (typeof value === 'string' && value.trim()) {
    return value
  }
  if (typeof value === 'number') {
    return String(value)
  }
  return undefined
}

const get_resource_key = (resource: TJsonapiResponseResource): string | undefined => {
  return to_optional_string(resource.id)
    || to_optional_string(resource.attributes?.id)
    || to_optional_string(resource.attributes?._id)
    || to_optional_string(resource.attributes?.videoid)
    || to_optional_string(resource.attributes?.slug)
    || to_optional_string(resource.attributes?.url)
}

/** `POST /<random_prefix>` endpoint handler */
const post_state_bootstrap_endpoint = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const { usr, token, themeMode: theme } = req
  const context: IStateContext = { usr, token, theme }
  try {
    const query = req.query as IBootstrapQuery
    const filter = query.filter
    const parsedSearchMode = to_valid_search_mode(filter?.search_mode || filter?.mode)
    const searchMode: TSearchMode = get_effective_search_mode(parsedSearchMode, Boolean(usr))
    const searchQuery = to_valid_search_query(filter?.search)
    const dialogState: TStateDialog = usr || searchQuery ? {} : visitorAlertDialogState
    const playerOpen = to_bool_or_undefined(filter?.player_open)
    const showThumbnail = to_bool_or_undefined(filter?.show_thumbnail)
    const playingBookmarkKey = filter?.playing_bookmark_key?.trim()
    const requestedPage = query.page?.number

    const bootstrapPagesData = (await new PrepareState(context).processAsync(
      bootstrap_pages_data_state
    )).get() as Record<string, Record<string, unknown>>

    const resolvedPage = playingBookmarkKey
      ? await resolve_bookmark_page_by_query({
        searchQuery,
        searchMode,
        limit: query.page?.size,
        usr,
        playingBookmarkKey,
      })
      : undefined

    const bookmarksCollection = await read_bookmark_collection_by_query({
      searchQuery,
      searchMode,
      page: resolvedPage || requestedPage || 1,
      limit: query.page?.size,
      usr
    })
    const bookmarkVotes = await read_bookmark_votes_for_user(usr, bookmarksCollection.docs)
    const {
      resources: bookmarksResources,
      included: bookmarksIncluded
    } = to_jsonapi_bookmark_resources(
      bookmarksCollection.docs,
      bookmarkVotes
    )
    const bookmarksData = bookmarksResources as unknown as TJsonapiResponseResource[]

    const playingBookmarkResource = playingBookmarkKey
      ? bookmarksData.find((resource) => get_resource_key(resource) === playingBookmarkKey)
      : undefined
    const playingBookmark = playingBookmarkResource
      ? {
        ...(playingBookmarkResource.attributes || {}),
        ...(to_optional_string(playingBookmarkResource.id)
          ? { id: to_optional_string(playingBookmarkResource.id) }
          : {})
      }
      : undefined

    bootstrapPagesData[EP_BOOKMARKS] = {
      ...(bootstrapPagesData[EP_BOOKMARKS] || {}),
      ...(typeof playerOpen === 'boolean' ? { playerOpen } : {}),
      ...(typeof showThumbnail === 'boolean' ? { showThumbnail } : {}),
      ...(playingBookmark ? { playingBookmarkPage: bookmarksCollection.page } : {}),
      bookmarkToPlay: playingBookmark
    }

    bootstrapPagesData[$40] = {
      ...(bootstrapPagesData[$40] || {}),
      searchMode,
      icon: SEARCH_ICON[searchMode],
      placeholder: SEARCH_PLACEHOLDER[searchMode]
    }

    const state = {
        'app': new PrepareState(context).process(
          bootstrap_app_state
        ).get(),
        'theme': new PrepareState(context).process(
          bootstrap_theme_state
        ).get(),
        'themeLight': new PrepareState(context).process(
          bootstrap_theme_light_state
        ).get(),
        'themeDark': new PrepareState(context).process(
          bootstrap_theme_dark_state
        ).get(),
        'appbar': new PrepareState(context).process(
          bootstrap_appbar_state
        ).get(),
        'icons': new PrepareState<TStateAllIcons>(context).process(
          bootstrap_icons_state
        ).get(),
        'pages': new PrepareState(context).process(
          bootstrap_pages_state
        ).get(),
        'pagesLight': new PrepareState(context).process(
          bootstrap_pages_light_state
        ).get(),
        'pagesDark': new PrepareState(context).process(
          bootstrap_pages_dark_state
        ).get(),
        'pagesData': bootstrapPagesData,
        'background': new PrepareState(context).process(
          bootstrap_background_state
        ).get(),
        'forms': new PrepareState(context).process(
          bootstrap_forms_state
        ).get(),
        'formsLight': new PrepareState(context).process(
          bootstrap_forms_light_state
        ).get(),
        'formsDark': new PrepareState(context).process(
          bootstrap_forms_dark_state
        ).get(),
        'dialog': dialogState,
        'dialogs': new PrepareState(context).process(
          bootstrap_dialogs_state
        ).get(),
        'dialogsLight': new PrepareState(context).process(
          bootstrap_dialogs_light_state
        ).get(),
        'dialogsDark': new PrepareState(context).process(
          bootstrap_dialogs_dark_state
        ).get(),
        'staticRegistry': get_registry('state'),
        ...(usr ? { 'net': {
          'name': usr.name,
          'role': usr.role,
          'token': token,
          '_id': usr._id.toString(),
        }} : {
          // Originally, session was null but it crashed the app
          'net': undefined,
        })
      }

    const paginationLinks = new JsonapiPaginationBuilder(
      get_pagination_options({
        totalDocs: bookmarksCollection.totalItems,
        page: bookmarksCollection.page,
        limit: bookmarksCollection.limit,
        filter: bookmarksCollection.filter,
      })
    ).build()

    reply.send({
      state,
      data: bookmarksData,
      links: paginationLinks,
      meta: {
        max_loaded_pages: Config.MAX_LOADED_BOOKMARK_PAGES,
      },
      ...(bookmarksIncluded.length > 0 ? { included: bookmarksIncluded } : {})
    } as TJsonapiStateResponse)
  } catch (e) {
    log_err('in attempting to bootstrap state', e)
    reply.code(500).send(error_id(50037).default_500_error_response(e))
  }
}

export default post_state_bootstrap_endpoint