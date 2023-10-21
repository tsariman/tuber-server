import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { remove_form_suffix } from './_forms.business.logic'

const _24 = '24'
const _24_KEY = 'newFacebookAnnotationForm'
Config.register('state', _24, _24_KEY)
/** Form for creating a new facebook video annotation @id 24 */
const newFacebookAnnotationFormState = {
  '_id': _24,
  '_key': _24_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textarea',
          'name': 'embed_url',
          'label': 'Embed HTML Code',
          'props': {
            'fullWidth': true,
            'multiline': true,
            'rows': 5
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

export const NEW_FACEBOOK_ANNOTATION_UNSUFFIXED_NAME = remove_form_suffix(
  newFacebookAnnotationFormState._key
)

export default newFacebookAnnotationFormState