import { FastifyReply, FastifyRequest } from 'fastify'
import { check_password } from '../../business.logic/security'
import { alertResponse as alert } from '../../state/dialog'
import { IRequestAuth } from '../../common.types'
import {
	error_id,
} from '../../business.logic/errors'
import {
	TJsonapiStateResponse,
	EP_AUTH,
	EP_BOOKMARKS,
	MSG_500_ERROR_MESSAGE,
	THEME_MODE,
	TThemeMode,
	THEME_DEFAULT_MODE,
	type TJsonapiResponseResource
} from '@tuber/shared'
import get_bootstrap_authenticated_state from '../../state/bootstrap'
import { get_contextual_user, read_user } from '../../model/session'
import { normalize_route, option } from '../../business.logic'
import { USER_CACHE } from '../../business.logic/cache'
import { log_safe, log_err_safe, task, dbug } from '../../utility/logging'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import RequestDataValidator from '../../business.logic/RequestDataValidator'
import signInFormState from '../../state/form/sign.in.form.state'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { is_record, to_error_object } from '../../utility'
import Config from '../../config'
import { get_auth_cookie_options, SIGNIN_MAX_ATTEMPTS, SIGNIN_WINDOW_MS, signinAttempts } from './shared'
import { read_bookmark_collection_by_query, read_bookmark_votes_for_user, to_jsonapi_bookmark_resources } from '../../model/bookmark'
import JsonapiPaginationBuilder, { get_pagination_options } from '../../business.logic/builder/JsonapiPaginationBuilder'
import { TSearchMode } from '../../common.types'

const VALID_SEARCH_MODE: TSearchMode[] = ['public', 'private', 'all']

const to_valid_search_mode = (mode?: string): TSearchMode | undefined => {
	if (!mode) {
		return undefined
	}
	if (VALID_SEARCH_MODE.includes(mode as TSearchMode)) {
		return mode as TSearchMode
	}
	return undefined
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

const parse_query_continuity_intent = (query?: string): {
	searchMode?: TSearchMode
	searchQuery?: string
} => {
	if (typeof query !== 'string' || !query.trim()) {
		return {}
	}

	const normalized = query.startsWith('?') ? query.substring(1) : query
	const params = new URLSearchParams(normalized)
	const searchMode = to_valid_search_mode(
		params.get('filter[search_mode]') || params.get('filter[mode]') || undefined
	)
	const searchQuery = to_valid_search_query(params.get('filter[search]') || undefined)

	return {
		searchMode,
		searchQuery,
	}
}

/** `POST /signin` endpoint handler */
export default async function post_sign_in_endpoint (
	req: FastifyRequest<IRequestAuth>,
	reply: FastifyReply,
) {
	let usernameForLog = '(unknown)'
	try {
		const skipRateLimit = process.env.SKIP_RATE_LIMIT === 'true'

		task('Enforcing rate limiting ')
		if (!skipRateLimit) {
			const ip = (req.ip || req.headers['x-forwarded-for'] as string || 'unknown').toString()
			const now = Date.now()
			const entry = signinAttempts.get(ip)
			if (!entry || now > entry.resetAt) {
				signinAttempts.set(ip, { count: 1, resetAt: now + SIGNIN_WINDOW_MS })
			} else {
				entry.count += 1
				if (entry.count > SIGNIN_MAX_ATTEMPTS) {
					task.end('[❌]')
					dbug('[429] Rate limit exceeded for IP:', ip)
					reply.code(429).send(new JsonapiErrorBuilder()
						.withStatus(429)
						.withCode('RATE_LIMITED')
						.withTitle('Too Many Requests')
						.withDetail('Please wait a minute before trying again.')
						.build())
					return
				}
			}
			task.end('[✔️]')
		} else {
			task.end('[⚠️]')
			dbug('Rate limiting is disabled')
		}

		task('Checking credentials ')
		const driver = new JsonapiRequestDriver(req.body)
		const credentials = driver.getAttribute('credentials')
		if (!is_record(credentials) || !credentials.username || !credentials.password) {
			task.end('[❌]')
			dbug('[400] Invalid or missing credentials')
			reply.code(400).send(new JsonapiErrorBuilder()
				.withStatus(400)
				.withCode('MALFORMED_REQUEST')
				.withTitle('Credentials Required')
				.withDetail('No credentials were provided in the request')
				.build())
			return
		}
		task.end('[✔️]')

		const { username, password, options: o } = credentials
		usernameForLog = username
		const validator = new RequestDataValidator(credentials, signInFormState)
		log_safe('Authenticating user credentials', req.body)
		task('Validating signin request data ')
		const errorResponse = validator.validateAgainstFormState()
		if (errorResponse) {
			task.end('[❌]')
			dbug('[400] Validation errors in signin request', errorResponse)
			reply.code(400).send(errorResponse)
			return
		}
		task.end('[✔️]')

		const title = 'Wrong username or password!'
		task('Looking up user in the database ')
		const user = await read_user({ name: username, includePassword: true })
		if (!user) {
			task.end('[❌]')
			dbug('[401] No user found with username:', username)
			reply.code(401).send({
				...alert(title),
				...new JsonapiErrorBuilder()
					.withStatus(401)
					.withCode('AUTHENTICATION_REQUIRED')
					.withTitle(title)
					.build()
			})
			return
		}
		task.end('[✔️]')
		dbug('User found for authentication:', username)
		task('Verifying password ')
		if (!user.password) {
			task.end('[❌]')
			dbug('[401] Missing password for user:', username)
			reply.code(401).send({
				...alert(title),
				...new JsonapiErrorBuilder()
					.withStatus(401)
					.withCode('AUTHENTICATION_REQUIRED')
					.withTitle(title)
					.build()
			})
			return
		}
		const passwordIsCorrect = await check_password(password, user.password)
		if (!passwordIsCorrect) {
			task.end('[❌]')
			dbug('[401] Incorrect password for user:', username)
			reply.code(401).send({
				...alert(title),
				...new JsonapiErrorBuilder()
					.withStatus(401)
					.withCode('AUTHENTICATION_REQUIRED')
					.withTitle(title)
					.build()
			})
			return
		}
		task.end('[✔️]')

		task('Updating last_signin_at timestamp ')
		user.last_signin_at = new Date()
		await user.save()
		task.end('[✔️]')

		task('Generating authentication token ')
		USER_CACHE.set(user.name, user)
		const usr = get_contextual_user(user)
		const expiresIn = option<string>(o)('keep-signed-in', '60d', '1d')
		const token = await reply.jwtSign(usr, { expiresIn })
		task.end('[✔️]')
		dbug('Expires in', expiresIn === '60d'
			? '2 months.'
			: '24 hours.')
		const themeCandidate = req.themeMode
			|| driver.getAttribute('theme_mode')
			|| Config.read<TThemeMode>(THEME_MODE, THEME_DEFAULT_MODE)
		const theme: TThemeMode = themeCandidate === 'light' || themeCandidate === 'dark'
			? themeCandidate
			: THEME_DEFAULT_MODE

		task('Setting authentication cookie ')
		reply.setCookie(
			'token',
			token,
			get_auth_cookie_options(
				req,
				expiresIn === '60d' ? 60 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
			)
		)
		task.end('[✔️]')
		const normalizedRoute = normalize_route(driver.getAttribute('route'))
		const isSigninPage = normalizedRoute === EP_AUTH.CLIENT_IN
		const query = driver.getAttribute('query')
		const continuityIntent = parse_query_continuity_intent(
			typeof query === 'string' ? query : undefined
		)
		const bootstrapState = await get_bootstrap_authenticated_state({
			usr,
			theme,
			query: typeof query === 'string' ? query : undefined
		})
		if (isSigninPage) {
			bootstrapState.app ??= {}
			bootstrapState.app.route = '/'
			bootstrapState.pages ??= {}
			bootstrapState.pages[EP_AUTH.CLIENT_IN] = { __delete: true }
			bootstrapState.pagesDark ??= {}
			bootstrapState.pagesDark[EP_AUTH.CLIENT_IN] = { __delete: true }
			bootstrapState.pagesLight ??= {}
			bootstrapState.pagesLight[EP_AUTH.CLIENT_IN] = { __delete: true }
		}

		if (!continuityIntent.searchMode || continuityIntent.searchMode === 'public') {
			reply.code(200).send({ 'state': bootstrapState } as TJsonapiStateResponse)
			return
		}

		const continuitySearchQuery = continuityIntent.searchMode === 'all'
			? continuityIntent.searchQuery
			: undefined

		const bookmarksCollection = await read_bookmark_collection_by_query({
			searchMode: continuityIntent.searchMode,
			searchQuery: continuitySearchQuery,
			page: 1,
			usr
		})
		const bookmarkVotes = await read_bookmark_votes_for_user(usr, bookmarksCollection.docs)
		const {
			resources: bookmarksResources,
			included: bookmarksIncluded,
		} = to_jsonapi_bookmark_resources(
			bookmarksCollection.docs,
			bookmarkVotes
		)

		const paginationLinks = new JsonapiPaginationBuilder(
			get_pagination_options({
				totalDocs: bookmarksCollection.totalItems,
				page: bookmarksCollection.page,
				limit: bookmarksCollection.limit,
				filter: bookmarksCollection.filter,
			})
		).build()

		reply.code(200).send({
			state: bootstrapState,
			data: bookmarksResources as unknown as TJsonapiResponseResource[],
			links: paginationLinks,
			meta: {
				max_loaded_pages: Config.MAX_LOADED_BOOKMARK_PAGES,
				collection_endpoint: EP_BOOKMARKS,
				replace_collection: true,
			},
			...(bookmarksIncluded.length > 0 ? { included: bookmarksIncluded } : {}),
		} as TJsonapiStateResponse)
	} catch (e) {
		task.end(MSG_500_ERROR_MESSAGE.replace('[500]', '[5005]'))
		const error = to_error_object(e)
		log_err_safe('[5005] Error attempting to authenticate user', {
			error,
			username: usernameForLog
		})
		reply.code(500).send({
			...error_id(5005).default_500_error_response(e),
			...alert(error.message),
		})
	}
}
