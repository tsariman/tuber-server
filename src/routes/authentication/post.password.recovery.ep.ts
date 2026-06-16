import crypto from 'crypto'
import { FastifyReply, FastifyRequest } from 'fastify'
import { TJsonapiRequest, TJsonapiStateResponse } from '@tuber/shared'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import RequestDataValidator from '../../business.logic/RequestDataValidator'
import passwordRecoveryFormState from '../../state/form/password.recovery.form.state'
import passwordRecoveryCodeDialogState from '../../state/dialog/password.recovery.code.dialog.state'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import { error_id } from '../../business.logic/errors'
import { is_record, to_error_object } from '../../utility'
import { UserModel } from '../../model/user'
import { log_err_safe } from '../../utility/logging'
import { sendPasswordRecoveryEmail } from '../../utility/mailer'
import { PASSWORD_RECOVERY_TOKEN_TTL_MS } from './shared'
import STATE_KEY from '../../business.logic/state.key'

const $93 = STATE_KEY['93']

/** `POST /password/recovery` endpoint handler */
export default async function post_password_recovery_endpoint (
	req: FastifyRequest<{ Body: TJsonapiRequest<{ email?: string }> }>,
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
				.withDetail('No form data was provided in the request.')
				.build())
			return
		}

		const validator = new RequestDataValidator(attributes, passwordRecoveryFormState)
		const errorResponse = validator.validateAgainstFormState()
		if (errorResponse) {
			reply.code(400).send(errorResponse)
			return
		}

		const email = typeof attributes.email === 'string'
			? attributes.email.trim().toLowerCase()
			: ''

		if (email) {
			const user = await UserModel.findOne({
				email,
				is_active: { $ne: false }
			})

			if (user) {
				const token = crypto.randomInt(0, 1000000).toString().padStart(6, '0')
				user.password_reset_token = token
				user.password_reset_expires = new Date(Date.now() + PASSWORD_RECOVERY_TOKEN_TTL_MS)
				user.modified_at = new Date()
				await user.save()

				sendPasswordRecoveryEmail(user.email, token).catch((error) => {
					log_err_safe('[5008] Password recovery email delivery failed', {
						error: to_error_object(error),
						email,
					})
				})
			}
		}

		reply.code(200).send({
			'state': {
				'dialog': passwordRecoveryCodeDialogState,
				'formsData': {
					[$93]: {
						email
					}
				}
			}
		} as TJsonapiStateResponse)
	} catch (e) {
		log_err_safe('[5008] Error creating password recovery token', {
			error: to_error_object(e),
		})
		reply.code(500).send(error_id(5008).default_500_error_response(e))
	}
}
