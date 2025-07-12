import { FastifyRequest, FastifyReply } from 'fastify';
import Config from '../../config';
import { default_500_error_response } from '../../business.logic/jsonapi.error.builder';
import Switch from '../../business.logic/form.item.switch.single.state.builder';

export default async function dev_get_single_switch_builder_state(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    Config.print(`[DEBUG] Testing single switch builder state... `);
    reply.code(200).send(new Switch()
      .withName('is_published')
      .withLabel('Published')
      .hasHelperText('Is this bookmark published?')
      .build()
    );
    Config.log('Done.');
  } catch (error) {
    Config.print(`[ERROR] dev_get_single_switch_builder_state: ${error}`);
    reply.code(500).send(default_500_error_response(error));
  }
}