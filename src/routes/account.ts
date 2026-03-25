import { FastifyPluginAsync, FastifyReply, FastifyRequest } from 'fastify'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { DEFAULT_ROUTE_OPTIONS } from '../middleware/router.option'
import JsonapiErrorBuilder from '../business.logic/builder/JsonapiErrorBuilder'
import JsonapiResponseBuilder from '../business.logic/builder/JsonapiResponseBuilder'
import { error_id } from '../business.logic/errors'
import { read_user_by_id, transform_user_doc, UserModel } from '../model/user'
import { USER_CACHE } from '../business.logic/cache'
import { ler, log_err } from '../utility/logging'

/** `GET /account` endpoint handler */
const get_account_endpoint = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = req.usr?._id
    if (!userId) {
      reply.code(401).send(new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle('Authorization failed.')
        .withDetail('No authenticated user context was found for this request.')
        .build())
      return
    }

    const user = await read_user_by_id(userId)
    if (!user) {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Account Not Found')
        .withDetail('Could not find an account for the authenticated user.')
        .build())
      return
    }

    reply.code(200).send(JsonapiResponseBuilder
      .forSingleResource(transform_user_doc(user), 'account')
      .withId(user._id)
      .build())
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5052]'))
    log_err('[5052] GET account', e)
    reply.code(500).send(error_id(5052).default_500_error_response(e))
  }
}

/** `DELETE /account` endpoint handler (soft delete for authenticated account). */
const delete_account_endpoint = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const userId = req.usr?._id
    const userName = req.usr?.name
    if (!userId) {
      reply.code(401).send(new JsonapiErrorBuilder()
        .withStatus(401)
        .withCode('AUTHENTICATION_REQUIRED')
        .withTitle('Authorization failed.')
        .withDetail('No authenticated user context was found for this request.')
        .build())
      return
    }

    const updatedUser = await UserModel.findOneAndUpdate(
      { _id: userId, is_active: { $ne: false } },
      {
        is_active: false,
        jwt_version: (req.usr?.jwt_version ?? 0) + 1,
        modified_at: new Date()
      },
      { new: true }
    )

    if (!updatedUser) {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('Account Not Found')
        .withDetail('Could not find an active account for the authenticated user.')
        .build())
      return
    }

    if (userName) {
      USER_CACHE.del(userName)
    }
    reply.clearCookie('token', { path: '/' })
    reply.code(204).send()
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[5053]'))
    log_err('[5053] DELETE account', e)
    reply.code(500).send(error_id(5053).default_500_error_response(e))
  }
}

const account: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {
  const opts = {
    ...rootOpts,
    ...DEFAULT_ROUTE_OPTIONS,
  }

  fastify.get('/account', opts, get_account_endpoint)
  fastify.delete('/account', opts, delete_account_endpoint)
}

export default account