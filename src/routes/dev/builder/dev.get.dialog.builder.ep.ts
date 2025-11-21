import { FastifyReply, FastifyRequest } from 'fastify'
import { ler, task, task_end } from '../../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { default_500_error_response } from '../../../business.logic/errors'
import DialogStateBuilder from '../../../business.logic/builder/DialogStateBuilder'
import FormItemButtonBuilder from '../../../business.logic/builder/FormItemButtonStateBuilder'

/** GET /dev/builder/dialog */
export default async function dev_get_dialog_builder_endpoint(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    task(`[DEBUG] Testing dialog builder state... `)
    const id = Math.random().toString(36).substring(7)
    reply.code(200).send(new DialogStateBuilder()
      .with_Id(id)
      .with_Key('builderDialogState')
      .with_Type('alert')
      .withTitle('Dialog Builder Alert State')
      .withContentText('This is the dialog builder alert state.')
      .withActionButton(new FormItemButtonBuilder()
        .withName('close')
        .withText('Close', 'has_label')
        .hasOnclickHandle('tuberCallbacks.defaultClose')
      )
      .withActionButton(new FormItemButtonBuilder()
        .withName('submit')
        .withText('Submit')
        .hasOnclickHandle('tuberCallbacks.devSubmitDialog')
      )
      .withBootstrapState()
      .buildResponse()
    )
    task_end('Done.')
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE, e)
    reply.code(500).send(default_500_error_response(e))
  }
}
