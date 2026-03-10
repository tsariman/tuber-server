import { FastifyRequest, FastifyReply } from 'fastify'
import { errr, task, task_end } from '../../../utility/logging'
import { error_id } from '../../../business.logic/errors'
import Switch from '../../../business.logic/builder/FormItemSwitchSingleStateBuilder'

export default async function dev_get_switch_single_builder_endpoint(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    task(`[DEBUG] Testing single switch builder state... `)
    reply.code(200).send(new Switch()
      .withName('is_published')
      .withLabel('Published')
      .hasHelperText('Is this bookmark published?')
      .build()
    );
    task_end('Done.')
  } catch (error) {
    errr(`dev_get_switch_single_builder_state: ${error}`)
    reply.code(500).send(error_id(5034).default_500_error_response(error))
  }
}