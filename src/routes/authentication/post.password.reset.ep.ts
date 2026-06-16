import { FastifyReply, FastifyRequest } from 'fastify'
import { TJsonapiRequest } from '@tuber/shared'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { get_hashed_password } from '../../business.logic/security'
import { is_record, to_error_object } from '../../utility'
import { UserModel } from '../../model/user'
import { log_err_safe } from '../../utility/logging'
import { USER_CACHE } from '../../business.logic/cache'
import { PASSWORD_RECOVERY_CODE_REGEX } from './shared'
import STATE_KEY from '../../business.logic/state.key'

const $90 = STATE_KEY['90']

/** `POST /password/reset` endpoint handler */
export default async function post_password_reset_endpoint (
	req: FastifyRequest<{ Body: TJsonapiRequest<{ email?: string; token?: string; password?: string }> }>,
	reply: FastifyReply,
) {
	try {
		const driver = new JsonapiRequestDriver(req.body)
		const attributes = driver.getAttributes()

		if (!is_record(attributes)) {
			reply.code(400).send(new JsonapiErrorBuilder()
				.withStatus(400)
				.withCode('MALFORMED_REQUEST')
				.withTitle('Invalid Request')
				.withDetail('Email, token, and password are required.')
				.build())
			return
		}

		const email = typeof attributes.email === 'string'
			? attributes.email.trim().toLowerCase()
			: ''
		const token = typeof attributes.token === 'string'
			? attributes.token.trim()
			: ''
		const password = typeof attributes.password === 'string'
			? attributes.password.trim()
			: ''

		if (!email || !token || !password) {
			reply.code(400).send(new JsonapiErrorBuilder()
				.withStatus(400)
				.withCode('VALIDATION_ERROR')
				.withTitle('Missing recovery data')
				.withDetail('Email, token, and a new password are required.')
				.build())
			return
		}

		if (!PASSWORD_RECOVERY_CODE_REGEX.test(token)) {
			reply.code(400).send(new JsonapiErrorBuilder()
				.withStatus(400)
				.withCode('VALIDATION_ERROR')
				.withTitle('Invalid recovery token')
				.withDetail('Recovery token must be exactly 6 digits.')
				.build())
			return
		}

		if (password.length < 8) {
			reply.code(400).send(new JsonapiErrorBuilder()
				.withStatus(400)
				.withCode('VALIDATION_ERROR')
				.withTitle('Password is too weak')
				.withDetail('Password must be at least 8 characters long.')
				.build())
			return
		}

		const user = await UserModel.findOne({
			email,
			password_reset_token: token,
			is_active: { $ne: false }
		})

		if (!user || !user.password_reset_expires || user.password_reset_expires.getTime() < Date.now()) {
			reply.code(400).send(new JsonapiErrorBuilder()
				.withStatus(400)
				.withCode('TOKEN_EXPIRED')
				.withTitle('Invalid or expired recovery token')
				.withDetail('Please request a new password recovery email and try again.')
				.build())
			return
		}

		user.password = await get_hashed_password(password)
		user.password_reset_token = undefined
		user.password_reset_expires = undefined
		user.jwt_version = (user.jwt_version ?? 0) + 1
		user.modified_at = new Date()
		await user.save()
		USER_CACHE.del(user.name)
		reply.code(200).send({
			'state': {
				'app': {
					'route': 'default-success',
				},
				'tmp': {
					'default-success': {
						'message': 'Your password has been updated. You can now sign in with your new password.'
					}
				},
				'dialog': { open: false },
				'pages': { [$90]: { __delete: true } },
				'pagesDark': { [$90]: { __delete: true } },
				'pagesLight': { [$90]: { __delete: true } },
			}
		})
	} catch (e) {
		log_err_safe('[5009] Error resetting password with recovery token', {
			error: to_error_object(e),
		})
		reply.code(500).send(error_id(5009).default_500_error_response(e))
	}
}
