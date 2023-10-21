import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { remove_form_suffix } from './_forms.business.logic'

const _29 = '29'
const _29_KEY = 'editUnknownAnnotationForm'
Config.register('state', _29, _29_KEY)
/** Form for editing an existing unknown platform video annotation @id 29 */
const editUnknownAnnotationFormState = {
  '_id': _29,
  '_key': _29_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textfield',
          'name': 'url',
          'label': 'Video URL',
          'props': { 'fullWidth': true },
          'inputProps': {
            'readOnly': true,
            'sx': { 'backgroundColor': 'grey.300' }
          }
        },
        {
          'type': 'textfield',
          'name': 'embed_url',
          'label': 'Embed IFRAME URL',
          'props': { 'fullWidth': true },
          'inputProps': {
            'readOnly': true,
            'sx': { 'backgroundColor': 'grey.300' }
          }
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

export const EDIT_UNKNOWN_ANNOTATION_UNSUFFIXED_NAME = remove_form_suffix(
  editUnknownAnnotationFormState._key
)

export default editUnknownAnnotationFormState