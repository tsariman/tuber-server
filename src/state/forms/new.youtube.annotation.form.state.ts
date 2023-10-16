import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { remove_form_suffix } from './_forms.business.logic'

const _4 = '4'
const _4_KEY = 'newYouTubeAnnotationForm'
Config.register('state', _4, _4_KEY)
/** Form for creating a new YouTube video annotation @id 4 */
const newYouTubeAnnotationFormState = {
  '_id': _4,
  '_key': _4_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        // {
        //   'type': 'textfield',
        //   'name': 'url',
        //   'label': 'Video URL',
        //   'props': {
        //     'fullWidth': true,
        //     'sx': { 'backgroundColor': 'grey.300' }
        //   },
        //   'inputProps': { 'readOnly': true }
        // },
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
          }
        }
      ]
    },
  ]
} as IStateForm

export const NEW_YOUTUBE_ANNNOTATION_UNSUFFIXED_NAME = remove_form_suffix(
  newYouTubeAnnotationFormState._key
)

export default newYouTubeAnnotationFormState