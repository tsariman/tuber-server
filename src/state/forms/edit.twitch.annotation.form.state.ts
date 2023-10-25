import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { remove_form_suffix } from './_forms.business.logic'

const _39 = '39'
const _39_KEY = 'editTwitchAnnotationForm'
Config.register('state', _39, _39_KEY)
/** Form for editing an existing Twitch annotation. @id 39 */
const editTwitchAnnotationFormState = {
  '_id': _39,
  '_key': _39_KEY, // 'editAnnotationForm',
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
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
                'sx': { 'width': 240 }
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
              'inputProps': {
                'readOnly': true,
                'sx': { 'backgroundColor': 'grey.300' }
              }
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
            'required': true,
            'requiredMessage': 'You need a title.',
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
          },
          'has': {
            'maxLength': 1000,
            'maxLengthMessage': 'Note is too long. (1000 characters max)'
          }
        }
      ]
    },
  ]
} as IStateForm

export const EDIT_TWITCH_ANNOTATION_UNSUFFIXED_NAME = remove_form_suffix(
  editTwitchAnnotationFormState._key
)

export default editTwitchAnnotationFormState