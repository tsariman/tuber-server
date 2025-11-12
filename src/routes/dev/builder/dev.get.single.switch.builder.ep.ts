import { FastifyRequest, FastifyReply } from 'fastify'
import { log, write as print } from '../../../utility/logging'
import { default_500_error_response } from '../../../business.logic/errors'
import Switch from '../../../business.logic/builder/FormItemSwitchSingleStateBuilder'

export default async function dev_get_single_switch_builder_endpoint(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    print(`[DEBUG] Testing single switch builder state... `)
    reply.code(200).send(new Switch()
      .withName('is_published')
      .withLabel('Published')
      .hasHelperText('Is this bookmark published?')
      .build()
    );
    log('Done.')
  } catch (error) {
    print(`[ERROR] dev_get_single_switch_builder_state: ${error}`)
    reply.code(500).send(default_500_error_response(error))
  }
}