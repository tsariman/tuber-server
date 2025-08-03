import { r } from 'src/business.logic';
import { TStateForm } from '../../shared';
import { register } from '../../business.logic/registry';
import * as C from '../../constants.server';

register('state', '39', C.$39_STATE_KEY);
/** Form for editing an existing Twitch bookmark. @id 39 */
const editTwitchBookmarkFormState = {
  '_id': '39',
  '_key': C.$39_STATE_KEY,
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
              'label': r('132', 'Start'),
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                'requiredMessage': r('133', C.START_SECONDS_REQUIRED_MESSAGE),
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              'label': r('134', 'Video ID'),
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': r('135', 'Platform'),
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
          'label': r('136', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': r('137', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': r('138', C.TITLE_MAX_LENGTH),
            'maxLengthMessage': r('139', C.TITLE_MAX_LENGTH_MESSAGE),
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('140', 'Note'),
          'props': {
            'multiline': true,
            'rows': r('141', C.NOTE_FIELD_ROWS)
          },
          'has': {
            'maxLength': r('142', C.NOTE_MAX_LENGTH),
            'maxLengthMessage': r('143', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'single_switch',
          'name': 'is_published',
          'label': r('144', 'Published'),
          'has': {
            'helperText': r('145', C.PUBLISHED_HELPER_TEXT)
          }
        }
      ]
    },
  ]
} as TStateForm;

export default editTwitchBookmarkFormState

export const $39DarkThemeMode = {
  ...editTwitchBookmarkFormState,
  // TODO - add dark theme overrides here
} as TStateForm

