import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { remove_form_suffix } from './_forms.business.logic'

const _28 = '28'
const _28_KEY = 'newUnknownAnnotationForm'
Config.register('state', _28, _28_KEY)
/** Form for creating a new unknown video annotation @id 28 */
const newUnknownAnnotationFormState = {
  '_id': _28,
  '_key': _28_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textfield',
          'name': 'url',
          'label': 'Video URL',
          'props': {
            'fullWidth': true,
          },
          'inputProps': {
            'readOnly': true,
            'sx': { 'backgroundColor': 'grey.300' }
          }
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

export const NEW_UNKNOWN_ANNOTATION_UNSUFFIXED_NAME = remove_form_suffix(
  newUnknownAnnotationFormState._key
)

export default newUnknownAnnotationFormState