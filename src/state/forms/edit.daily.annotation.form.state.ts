import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { remove_form_suffix } from './_forms.business.logic'

const _20 = '20'
const _20_KEY = 'editDailyAnnotationForm'
Config.register('state', _20, _20_KEY)
/** Form for editing an existing Dailymotion annotation. @id 20 */
const editDailyAnnotationFormState = {
  '_id': _20,
  '_key': _20_KEY, // 'editAnnotationForm',
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
                'sx': {
                  'width': 240,
                },
                'helperText': 'time in second(s)'
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
              'inputProps': {'disabled': true }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              'label': 'Video ID',
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
              'name': 'platform',
              'label': 'Platform',
              'props': {
                'sx': {
                  'width': 240,
                },
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

export const EDIT_DAILY_ANNOTATION_UNSUFFIXED_NAME = remove_form_suffix(
  editDailyAnnotationFormState._key
)

export default editDailyAnnotationFormState