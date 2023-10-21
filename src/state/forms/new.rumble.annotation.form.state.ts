import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { remove_form_suffix } from './_forms.business.logic'

const _9 = '9'
const _9_KEY = 'newRumbleAnnotationForm'
Config.register('state', _9, _9_KEY)
/** Form for creating a new rumble video annotation @id 9 */
const newRumbleAnnotationFormState = {
  '_id': _9,
  '_key': _9_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textfield',
          'name': 'slug',
          'label': 'Video URL Slug',
          'props': { 'fullWidth': true },
          'inputProps': {
            'readOnly': true,
            'sx': { 'backgroundColor': 'grey.300' }
          }
        },
        {
          'type': 'stack',
          'props': {
            'direction': 'row',
            'spacing': 1
          },
          'items': [
            {
              'type': 'number',
              'name': 'start_seconds',
              'label': 'Start',
              'props': {
                'sx': { 'width': 240 },
              },
              'inputProps': {
                'readOnly': true,
                'sx': { 'backgroundColor': 'grey.300' }
              },
            },
            {
              'type': 'number',
              'name': 'end_seconds',
              'label': 'Length',
              'props': {
                'sx': { 'width': 240 },
              },
              'inputProps': { 'disabled': true }
            },
            {
              'type': 'textfield',
              'name': 'embed_url',
              'label': 'Embed IFRAME URL',
              'props': {
                'fullWidth': true,
              },
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': 'Platform',
              'props': {
                'sx': { 'width': 240 },
              },
              'inputProps': {
                'readOnly': true,
                'sx': { 'backgroundColor': 'grey.300' }
              }
            },
          ]
        },
        {
          'type': 'textfield',
          'name': 'title',
          'label': 'TItle',
          'props': {
            'fullWidth': true
          },
          'has': {
            'maxLength': 80,
            'maxLengthMessage': 'Your title is too long. (80 characters max)'
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': 'Note',
          'props': {
            'multiline': true,
            'rows': 4
          }
        }
      ]
    },
  ]
} as IStateForm

export const NEW_RUMBLE_ANNOTATION_UNSUFFIXED_NAME = remove_form_suffix(
  newRumbleAnnotationFormState._key
)

export default newRumbleAnnotationFormState