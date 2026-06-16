import { FastifyReply, FastifyRequest } from 'fastify'
import { error_id, shielded_401_error_response } from '../../business.logic/errors'
import { USER_CACHE } from '../../business.logic/cache'
import { blacklist_token } from '../../model/blacklisted.token'
import { UserModel } from '../../model/user'
import { task, log_safe, dbug, errr, log_err_safe } from '../../utility/logging'
import { get_auth_cookie_options } from './shared'

/** `POST /signout` endpoint handler */
export default async function post_sign_out_endpoint (
	req: FastifyRequest,
	reply: FastifyReply,
) {
	task('Checking user data for signout ')
	try {
		if (!req.usr || !req.usr.name) {
			task.end('[❌]')
			task.log('[401] No authenticated user data found in request')
			reply.code(401).send(shielded_401_error_response())
			return
		}
		log_safe('[✔️]', req.usr)
		const { name } = req.usr
		task('Blacklisting authentication token ')
		if (req.token && process.env.ENABLE_TOKEN_BLACKLIST === 'true') {
			try {
				const payload = req.token.split('.')[1]
				const decodedPayload = JSON.parse(Buffer.from(payload, 'base64').toString())
				const expiresAt = decodedPayload?.exp ? new Date(decodedPayload.exp * 1000) : new Date(Date.now() + 24 * 60 * 60 * 1000)
				const blacklistDoc = await blacklist_token(req.token, expiresAt, 'user_signout')
				if (blacklistDoc) {
					task.end('[✔️]')
					dbug('Token blacklisted for user:', name)
				} else {
					task.end('[❌]')
					errr('[500] Failed to blacklist token for user:', name)
				}
			} catch {
				const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)
				const blacklistDoc = await blacklist_token(req.token, expiresAt, 'user_signout')
				if (blacklistDoc) {
					task.end('[✔️]')
					dbug('Token blacklisted with fallback expiration for user:', name)
				} else {
					task.end('[❌]')
					errr('[500] Failed to blacklist token for user:', name)
				}
			}
		} else {
			task.end('[⚠️]')
			dbug('Blacklisting skipped or token missing for user:', name)
		}

		USER_CACHE.del(name)
		reply.clearCookie('token', get_auth_cookie_options(req, 0))

		task('Incrementing jwt_version on signout ')
		try {
			const userDoc = await UserModel.findOne({ name })
			if (userDoc) {
				userDoc.jwt_version = (userDoc.jwt_version ?? 0) + 1
				await userDoc.save()
				task.end('[✔️]')
				dbug('Incremented jwt_version for user:', name, '->', userDoc.jwt_version)
				USER_CACHE.set(name, userDoc)
			}
		} catch (verErr) {
			task.end('[❌]')
			errr('[500] Failed to increment jwt_version on signout:', verErr)
		}
		task('Signing out authenticated user ')
		reply.code(204).send()
		task.end('[✔️]')
	} catch (e) {
		task.end('[5007]')
		log_err_safe('[5007] Error attempting signout user', {
			error: e,
			user: req.usr
		})
		reply.code(500).send(error_id(5007).default_500_error_response(e))
	}
}
