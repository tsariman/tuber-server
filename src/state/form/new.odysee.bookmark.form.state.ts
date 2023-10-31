import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { remove_form_suffix } from './_forms.business.logic'
import * as C from '../../constants'

const _17 = '17'
const _17_KEY = 'newOdyseeBookmarkForm'
Config.register('state', _17, _17_KEY)
/** Form for creating a new odysee video bookmark @id 17 */
const newOdyseeBookmarkFormState = {
  '_id': _17,
  '_key': _17_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        // {
        //   'type': 'textfield',
        //   'name': 'slug',
        //   'label': 'Video URL Slug',
        //   'props': { 'fullWidth': true },
        //   'inputProps': {
        //     'readOnly': true,
        //     'sx': { 'backgroundColor': 'grey.300' }
        //   }
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
                'sx': { 'width': 240 },
              },
              'inputProps': {
                'readOnly': true,
                'sx': { 'backgroundColor': 'grey.300' }
              },
              'has': {
                'required': true,
                'requiredMessage': C.START_SECONDS_REQUIRED_MESSAGE,
              }
            },
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
          'label': 'Title',
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': C.TITLE_REQUIRED_MESSAGE,
            'maxLength': C.TITLE_MAX_LENGTH,
            'maxLengthMessage': C.TITLE_MAX_LENGTH_MESSAGE
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': 'Note',
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            'maxLengthMessage': C.NOTE_MAX_LENGTH_MESSAGE
          }
        }
      ]
    },
  ]
} as IStateForm

export const NEW_ODYSEE_BOOKMARK_UNSUFFIXED_NAME = remove_form_suffix(
  newOdyseeBookmarkFormState._key
)

export default newOdyseeBookmarkFormState