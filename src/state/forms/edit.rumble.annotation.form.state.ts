import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { remove_form_suffix } from './_forms.business.logic'

const _10 = '10'
const _10_KEY = 'editRumbleAnnotationForm'
Config.register('state', _10, _10_KEY)
/** Form for creating a edit rumble video annotation @id 10 */
const editRumbleAnnotationFormState = {
  '_id': _10,
  '_key': _10_KEY,
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
            'sx': { 'backgroundColor': 'grey.300' }
          },
          'inputProps': { 'readOnly': true }
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
                'sx': {
                  'width': 240,
                  'backgroundColor': 'grey.300'
                },
              },
              'inputProps': { 'readOnly': true },
            },
            {
              'type': 'number',
              'name': 'end_seconds',
              'label': 'Length',
              'props': {
                'sx': { 'width': 240 }
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              'label': 'Video ID',
              'props': {
                'fullWidth': true,
                'sx': { 'backgroundColor': 'grey.300' }
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': 'Platform',
              'props': {
                'sx': {
                  'width': 240,
                  'backgroundColor': 'grey.300'
                },
              },
              'inputProps': { 'readOnly': true }
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

export const EDIT_RUMBLE_ANNOTATION_UNSUFFIXED_NAME = remove_form_suffix(
  editRumbleAnnotationFormState._key
)

export default editRumbleAnnotationFormState