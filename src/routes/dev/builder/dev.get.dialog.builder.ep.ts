import { FastifyReply, FastifyRequest } from 'fastify'
import { ler, log_err, task } from '../../../utility/logging'
import { MSG_500_ERROR_MESSAGE } from '@tuber/shared'
import { error_id } from '../../../business.logic/errors'
import DialogStateBuilder from '../../../business.logic/builder/DialogStateBuilder'
import FormItemButtonBuilder from '../../../business.logic/builder/FormItemButtonStateBuilder'

/** GET /dev/builder/dialog */
export default async function dev_get_dialog_builder_endpoint(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    task(`Testing dialog builder state... `)
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
        .hasOnclickHandler('tuberCallbacks.defaultClose')
      )
      .withActionButton(new FormItemButtonBuilder()
        .withName('submit')
        .withText('Submit')
        .hasOnclickHandler('tuberCallbacks.devSubmitDialog')
      )
      .withBootstrapState()
      .buildResponse()
    )
    task.end('[✔️]')
  } catch (e) {
    ler(MSG_500_ERROR_MESSAGE.replace('[500]', '[50032]'))
    log_err('[50032] DEV GET DIALOG BUILDER ERROR', e)
    reply.code(500).send(error_id(50032).default_500_error_response(e))
  }
}
