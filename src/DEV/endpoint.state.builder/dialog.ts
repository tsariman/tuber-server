import { FastifyReply, FastifyRequest } from 'fastify';
import { log, write as print } from '../../utility/logging';
import { MSG_500_ERROR_MESSAGE } from '../../constants.server';
import { default_500_error_response } from '../../business.logic/builder/jsonapi.error.builder';
import DialogStateBuilder from '../../business.logic/builder/dialog.state.builder';
import FormItemButtonBuilder from '../../business.logic/builder/form.item.button.state.builder';

export default async function dev_get_dialog_builder_state(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    print(`[DEBUG] Testing dialog builder state... `);
    const id = Math.random().toString(36).substring(7);
    reply.code(200).send(new DialogStateBuilder()
      .withId(id)
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
      .build()
    );
    log('Done.');
  } catch (e) {
    log(MSG_500_ERROR_MESSAGE, e);
    reply.code(500).send(default_500_error_response(e));
  }
}
