import { FastifyPluginAsync } from 'fastify'
import dev_get_dialog_builder_endpoint from './dev.get.dialog.builder.ep'
import dev_get_form_builder_endpoint from './dev.get.form.builder.ep'
import dev_get_single_switch_builder_endpoint from './dev.get.single.switch.builder.ep'
import Config from '../../../config'
import JsonapiErrorBuilder from '../../../business.logic/builder/JsonapiErrorBuilder'

const builder: FastifyPluginAsync = async (fastify, rootOpts): Promise<void> => {
  if (Config.DEV) {
     const opts = { ...rootOpts }
    // GET /dev/builder
    fastify.get('/', {}, (req, reply) => 
      reply.code(500).send(new JsonapiErrorBuilder()
        .withErrorMeta('url', `${req.protocol}://${req.hostname}${req.originalUrl}`)
        .build()
    ))
    // GET /dev/builder/dialog
    fastify.get('/dialog', {}, dev_get_dialog_builder_endpoint)
    // GET /dev/builder/form
    fastify.get('/form', opts, dev_get_form_builder_endpoint)
    // GET /dev/builder/single-switch
    fastify.get('/single-switch', opts, dev_get_single_switch_builder_endpoint)
  }
}

export default builder