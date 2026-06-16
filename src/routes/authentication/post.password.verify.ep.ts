import { FastifyReply, FastifyRequest } from 'fastify'
import { TJsonapiRequest, TJsonapiStateResponse } from '@tuber/shared'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { is_record, to_error_object } from '../../utility'
import { UserModel } from '../../model/user'
import { log_err_safe } from '../../utility/logging'
import passwordResetDialogState from '../../state/dialog/password.reset.dialog.state'
import { PASSWORD_RECOVERY_CODE_REGEX } from './shared'
import STATE_KEY from '../../business.logic/state.key'

const $89 = STATE_KEY['89']

/** `POST /password/verify` endpoint handler */
export default async function post_password_verify_endpoint (
	req: FastifyRequest<{ Body: TJsonapiRequest<{ email?: string; code?: string }> }>,
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
				.withDetail('Email and recovery code are required.')
				.build())
			return
		}

		const email = typeof attributes.email === 'string'
			? attributes.email.trim().toLowerCase()
			: ''
		const code = typeof attributes.code === 'string'
			? attributes.code.trim()
			: ''

		if (!email || !code) {
			reply.code(400).send(new JsonapiErrorBuilder()
				.withStatus(400)
				.withCode('VALIDATION_ERROR')
				.withTitle('Missing data')
				.withDetail('Email and recovery code are required.')
				.build())
			return
		}

		if (!PASSWORD_RECOVERY_CODE_REGEX.test(code)) {
			reply.code(400).send(new JsonapiErrorBuilder()
				.withStatus(400)
				.withCode('VALIDATION_ERROR')
				.withTitle('Invalid recovery code')
				.withDetail('Recovery code must be exactly 6 digits.')
				.build())
			return
		}

		const user = await UserModel.findOne({
			email,
			password_reset_token: code,
			is_active: { $ne: false }
		})

		if (!user || !user.password_reset_expires || user.password_reset_expires.getTime() < Date.now()) {
			reply.code(400).send(new JsonapiErrorBuilder()
				.withStatus(400)
				.withCode('TOKEN_EXPIRED')
				.withTitle('Invalid or expired recovery code')
				.withDetail('Please request a new password recovery email and try again.')
				.build())
			return
		}

		reply.code(200).send({
			'state': {
				'dialog': passwordResetDialogState,
				'formsData': {
					[$89]: {
						email,
						token: code
					}
				}
			}
		} as TJsonapiStateResponse)
	} catch (e) {
		log_err_safe('[5010] Error verifying password recovery code', {
			error: to_error_object(e),
		})
		reply.code(500).send(error_id(5010).default_500_error_response(e))
	}
}
