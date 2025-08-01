import { FastifyRequest, FastifyReply } from 'fastify';
import { log, write as print } from '../../config';
import { default_500_error_response } from '../../business.logic/builder/jsonapi.error.builder';
import Switch from '../../business.logic/builder/form.item.switch.single.state.builder';

export default async function dev_get_single_switch_builder_state(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    print(`[DEBUG] Testing single switch builder state... `);
    reply.code(200).send(new Switch()
      .withName('is_published')
      .withLabel('Published')
      .hasHelperText('Is this bookmark published?')
      .build()
    );
    log('Done.');
  } catch (error) {
    print(`[ERROR] dev_get_single_switch_builder_state: ${error}`);
    reply.code(500).send(default_500_error_response(error));
  }
}