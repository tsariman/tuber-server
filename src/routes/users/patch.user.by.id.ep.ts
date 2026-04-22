import { FastifyReply, FastifyRequest } from 'fastify'
import { Types } from 'mongoose'
import JsonapiErrorBuilder from '../../business.logic/builder/JsonapiErrorBuilder'
import JsonapiResponseBuilder from '../../business.logic/builder/JsonapiResponseBuilder'
import { error_id } from '../../business.logic/errors'
import { ler, log_err } from '../../utility/logging'
import { UserModel, transform_user_doc } from '../../model/user'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import Access from '../../business.logic/security/Access'
import JsonapiRequestDriver from '../../business.logic/JsonapiRequestDriver'
import { IPatchUserById, IUser } from '../../schema/user'

/** Attributes that admin is allowed to update via this endpoint. */
const ALLOWED_FIELDS: (keyof IUser)[] = [
  'role',
  'baseline_role',
  'is_active',
  'email_verified',
]

/** `PATCH /users/:id` — admin-only user attribute update */
export default async function patch_user_by_id_endpoint(
  req: FastifyRequest<IPatchUserById>,
  reply: FastifyReply
) {
  try {
    if (Access.the(req.usr).cannot('user.admin')) {
      reply.code(403).send(new JsonapiErrorBuilder()
        .withStatus(403)
        .withCode('INSUFFICIENT_PERMISSION')
        .withTitle('Forbidden')
        .withDetail('You do not have permission to update user accounts.')
        .build())
      return
    }

    const id = req.params?.id
    if (!id || !Types.ObjectId.isValid(id)) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('BAD_VALUE')
        .withTitle('Invalid ID')
        .withDetail('The provided user id is not a valid ObjectId.')
        .withSource({ parameter: 'id' })
        .build())
      return
    }

    const driver = new JsonapiRequestDriver(req.body)
    const raw = driver.getAttributes()
    if (!raw) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('MALFORMED_REQUEST')
        .withTitle('Missing attributes')
        .withDetail('Request body must include a data.attributes object.')
        .build())
      return
    }

    // Strip any fields that are not in the allow-list
    const updates: Partial<IUser> = {}
    for (const field of ALLOWED_FIELDS) {
      if (field in raw) {
        (updates as Record<string, unknown>)[field] = (raw as Record<string, unknown>)[field]
      }
    }

    if (Object.keys(updates).length === 0) {
      reply.code(400).send(new JsonapiErrorBuilder()
        .withStatus(400)
        .withCode('BAD_VALUE')
        .withTitle('No updatable fields provided')
        .withDetail(`Allowed fields: ${ALLOWED_FIELDS.join(', ')}`)
        .build())
      return
    }

    const user = await UserModel.findByIdAndUpdate(
      id,
      { ...updates, modified_at: new Date() },
      { new: true }
    )

    if (!user) {
      reply.code(404).send(new JsonapiErrorBuilder()
        .withStatus(404)
        .withCode('NOT_FOUND')
        .withTitle('User not found')
        .withDetail(`No user exists with id "${id}".`)
        .build())
      return
    }

    reply.code(200).send(
      JsonapiResponseBuilder.forSingleResource(transform_user_doc(user), 'users').build()
    )
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50051]'))
    log_err('[50051] PATCH user by id', e)
    reply.code(500).send(error_id(50051).default_500_error_response(e))
  }
}
