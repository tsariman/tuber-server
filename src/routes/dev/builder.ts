import { FastifyPluginAsync } from 'fastify'
import dev_get_dialog_builder_state from '../../dev/handlers/state.builder/dialog'
import dev_get_form_builder_state from '../../dev/handlers/state.builder/form'
import dev_get_single_switch_builder_state from '../../dev/handlers/state.builder/single.switch'
import Config from '../../config'

const builder: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {

  const opts = { ...rootOpts }

  // GET /dev/builder
  fastify.get('/builder', {}, async (_req, reply) => {
    reply.code(200).send({ message: 'Hello from dev builder controller.' })
  })

  if (Config.DEV) {
    // GET /dev/builder/dialog
    fastify.get('/builder/dialog', {}, dev_get_dialog_builder_state)
    // GET /dev/builder/form
    fastify.get('/builder/form', opts, dev_get_form_builder_state)
    // GET /dev/builder/single-switch
    fastify.get('/builder/single-switch', opts, dev_get_single_switch_builder_state)
  }
}

export default builder