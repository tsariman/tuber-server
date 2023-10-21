import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { remove_form_suffix } from './_forms.business.logic'

const _18 = '18'
const _18_KEY = 'editOdyseeAnnotationForm'
Config.register('state', _18, _18_KEY)
/** Form for creating a edit odysee video annotation @id 18 */
const editOdyseeAnnotationFormState = {
  '_id': _18,
  '_key': _18_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textfield',
          'name': 'slug',
          'label': 'Video URL Slug',
          'props': {
            'fullWidth': true,
          },
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
              'name': 'videoid',
              'label': 'Video ID',
              'props': { 'fullWidth': true },
              'inputProps': { 'disabled': true }
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
            'maxLength': 100,
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
          },
          'has': {
            'maxLength': 1000,
            'maxLengthMessage': 'Note is too long (1000 characters max)'
          }
        }
      ]
    },
  ]
} as IStateForm

export const EDIT_ODYSEE_ANNOTATION_UNSUFFIXED_NAME = remove_form_suffix(
  editOdyseeAnnotationFormState._key
)

export default editOdyseeAnnotationFormState