import { FastifyInstance } from 'fastify';
import dev_get_dialog_builder_state from './endpoint.state.builder/dialog';
import dev_get_form_builder_state from './endpoint.state.builder/form';
import dev_get_single_switch_builder_state from './endpoint.state.builder/single.switch';

export default async function dev_builder_controller(fastify: FastifyInstance) {
  fastify.get('/', {}, async (_req, reply) => {
    reply.code(200).send({ message: 'Hello from dev builder controller.' });
  });

  // /dev/builder/dialog
  fastify.get('/dialog', {}, dev_get_dialog_builder_state);
  // /dev/builder/form
  fastify.get('/form', {}, dev_get_form_builder_state);
  // /dev/builder/single-switch
  fastify.get('/single-switch', {}, dev_get_single_switch_builder_state);
}