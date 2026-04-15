import { FastifyReply, FastifyRequest } from 'fastify'
import { ler, log_err, task, task_end } from '../../../utility/logging'
import * as C from '@tuber/shared'
import { error_id } from '../../../business.logic/errors'
import Form from '../../../business.logic/builder/FormStateBuilder'
import Group from '../../../business.logic/builder/FormItemGroupStateBuilder'
import Numberfield from '../../../business.logic/builder/FormItemNumberfieldStateBuilder'
import Textfield from '../../../business.logic/builder/FormItemTextfieldStateBuilder'

/** GET /dev/builder/form */
export default async function dev_get_form_builder_endpoint(
  _req: FastifyRequest,
  reply: FastifyReply
) {
  try {
    task(`Testing form builder state... `)
    reply.code(200).send(new Form()
      .with_Id('4')
      .with_Key('newYoutubeBookmarkFormState')

      .addItem(new Group()
        .withType('stack')
        .withProps({ 'spacing': 2 })

        .add(new Group()
          .withType('stack')
          .withProps({ 'direction': 'row', 'spacing': 1 })

          .add(new Numberfield()
            .withName('start_seconds')
            .withLabel('Start')
            .withProps({ 'sx': { 'width': 240 }, 'variant': 'filled' })
            .withInputProps({
              'readOnly': true,
              'sx': { 'backgroundColor': 'grey.300' }
            })
            .isRequired()
            .hasRequiredMessage(C.START_SECONDS_REQUIRED_MESSAGE)
          )

          .add(new Numberfield()
            .withName('end_seconds')
            .withLabel('Length')
            .withProps({ 'sx': { 'width': 240 }, 'variant': 'filled' })
            .withInputProps({ 'disabled': true })
          )

          .add(new Textfield()
            .withName('videoid')
            .withLabel('Video ID')
            .withProps({ 'fullWidth': true, 'variant': 'filled' })
            .withInputProps({ 'readOnly': true })
          )

          .add(new Textfield()
            .withName('platform')
            .withLabel('Platform')
            .withProps({ 'sx': { 'width': 240 } })
            .withInputProps({ 'readOnly': true })
          )
        )
        .add(new Textfield()
          .withName('title')
          .withLabel('Title')
          .withProps({ 'fullWidth': true })
          .isRequired()
          .hasRequiredMessage(C.TITLE_REQUIRED_MESSAGE)
          .hasMaxLength(C.TITLE_MAX_LENGTH)
          .hasMaxLenghtMessage(C.TITLE_MAX_LENGTH_MESSAGE)
          .hasInvalidationRegex('[/#.]')
          .hasInvalidationMessage(`Characters not allowed: '/', '#', '.'`)
        )
        .add(new Textfield()
          .withName('note')
          .withLabel('Note')
          .withProps({
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS,
          })
          .hasMaxLength(C.NOTE_MAX_LENGTH)
          .hasMaxLenghtMessage(C.NOTE_MAX_LENGTH_MESSAGE)
        )
      )
      .withBootstrapState()
      .buildResponse()
    )
    task_end('Done.')
  } catch (e) {
    ler(C.MSG_500_ERROR_MESSAGE.replace('[500]', '[50033]'))
    log_err('[50033] DEV GET FORM BUILDER ERROR', e)
    reply.code(500).send(error_id(50033).default_500_error_response(e))
  }
}