import { FastifyPluginAsync, RouteOptions } from 'fastify'
import { EP_AUTH } from '@tuber/shared'
import post_sign_in_endpoint from './post.sign.in.ep'
import post_password_recovery_endpoint from './post.password.recovery.ep'
import post_password_verify_endpoint from './post.password.verify.ep'
import post_password_reset_endpoint from './post.password.reset.ep'
import post_sign_out_endpoint from './post.sign.out.ep'
import { shielded_401_error_response } from '../../business.logic/errors'
import OnRequestAuthorization from '../../business.logic/OnRequestAuthorization'

export const autoPrefix = ''

const authentication: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {
	const opts = { ...rootOpts }

	fastify.post(`/${EP_AUTH.IN}`, opts, post_sign_in_endpoint)
	fastify.post(`/${EP_AUTH.RECOVERY}`, opts, post_password_recovery_endpoint)
	fastify.post(`/${EP_AUTH.VERIFY}`, opts, post_password_verify_endpoint)
	fastify.post(`/${EP_AUTH.RESET}`, opts, post_password_reset_endpoint)

	const signoutOpts: Partial<RouteOptions> = {
		...opts,
		onRequest: async (req, reply): Promise<void> => {
			try {
				await (new OnRequestAuthorization(req))
					.disableBlacklist()
					.authorizeRequest()
			} catch {
				reply.code(401).send(shielded_401_error_response())
			}
		}
	}

	fastify.post(`/${EP_AUTH.OUT}`, signoutOpts, post_sign_out_endpoint)
}

export default authentication
