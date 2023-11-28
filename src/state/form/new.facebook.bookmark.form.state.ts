import { TStateForm } from '../../common.types'
import Config from '../../config'
import * as C from '../../constants'

Config.register('state', '24', C.$24_STATE_KEY)
/** Form for creating a new facebook video bookmark @id 24 */
const newFacebookBookmarkFormState = {
  '_id': '24',
  '_key': C.$24_STATE_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textfield',
          'name': 'url',
          'label': 'Link',
          'props': {
            'fullWidth': true,
            'variant': 'filled'
          },
          'inputProps': { 'readOnly': true },
          'has': {
            'required': true,
            'requiredMessage': C.URL_REQUIRED_MESSAGE,
          }
        },
        {
          'type': 'textfield',
          'name': 'embed_url',
          'label': 'Embed HTML Code',
          'props': {
            'fullWidth': true,
          },
          'has': {
            'required': true,
            'requiredMessage': 'We need the embed HTML code',
          }
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

export default newFacebookBookmarkFormState

export const $24DarkThemeMode = {
  ...newFacebookBookmarkFormState,
  // TODO - add dark theme mode overrides here
} as TStateForm
