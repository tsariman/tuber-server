import { TStateForm } from '../../common.types'
import Config from '../../config'
import * as C from '../../constants'

Config.register('state', '10', C.$10_STATE_KEY)
/** Form for creating a edit rumble video bookmark @id 10 */
const editRumbleBookmarkFormState = {
  '_id': '10',
  '_key': C.$10_STATE_KEY,
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
            'variant': 'filled'
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
                'sx': { 'width': 240 },
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
              'name': 'videoid',
              'label': 'Video ID',
              'props': {
                'fullWidth': true,
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
} as TStateForm

export default editRumbleBookmarkFormState

export const $10DarkThemeMode = {
  ...editRumbleBookmarkFormState,
  // TODO - add dark theme mode overrides
} as TStateForm
