import { TStateForm } from '../../common.types'
import Config from '../../config'
import * as C from '../../constants'

Config.register('state', '25', C.$25_KEY)
/** Form for creating a edit facebook video bookmark @id 25 */
const editFacebookBookmarkFormState = {
  '_id': '25',
  '_key': C.$25_KEY,
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
                'sx': { 'width': 160 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                'requiredMessage': C.START_SECONDS_REQUIRED_MESSAGE,
              }
            },
            {
              'type': 'textfield',
              'name': 'author',
              'label': 'Author',
              'props': {
                'fullWidth': true,
                'variant': 'filled',
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              'label': 'Video ID',
              'props': {
                'sx': { 'width': 320 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': 'Platform',
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
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
            'maxLengthMessage': C.TITLE_MAX_LENGTH_MESSAGE,
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
} as TStateForm

export default editFacebookBookmarkFormState

export const $25DarkThemeMode = {
  ...editFacebookBookmarkFormState,
  // TODO: Add dark theme overrides here
} as TStateForm
