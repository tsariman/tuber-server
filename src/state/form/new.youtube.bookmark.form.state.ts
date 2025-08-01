import { r } from 'src/business.logic';
import { TStateForm } from '../../common.types';
import { register } from '../../business.logic/registry';
import * as C from '../../constants';

register('state', '4', C.$4_STATE_KEY);
/** Form for creating a new YouTube video bookmark @id 4 */
const newYouTubeBookmarkFormState = {
  '_id': '4',
  '_key': C.$4_STATE_KEY,
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
              'label': r('261', 'Start'),
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': {
                'readOnly': true,
                'sx': { 'backgroundColor': 'grey.300' }
              },
              'has': {
                'required': true,
                'requiredMessage': r('262', C.START_SECONDS_REQUIRED_MESSAGE),
              }
            },
            {
              'type': 'number',
              'name': 'end_seconds',
              'label': r('263', 'Length'),
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'disabled': true }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              'label': r('264', 'Video ID'),
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': r('265', 'Platform'),
              'props': {
                'sx': { 'width': 240 },
              },
              'inputProps': { 'readOnly': true }
            },
          ]
        },
        {
          'type': 'textfield',
          'name': 'title',
          'label': r('266', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': r('267', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': C.TITLE_MAX_LENGTH,
            'maxLengthMessage': r('268', C.TITLE_MAX_LENGTH_MESSAGE),
            'invalidationRegex': r('269', '[/#.]'),
            'invalidationMessage': r('270', `Characters not allowed: '/', '#', '.'`)
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('271', 'Note'),
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            'maxLengthMessage': r('272', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        }
      ]
    },
  ]
} as TStateForm;

export default newYouTubeBookmarkFormState;

export const $4DarkThemeMode = {
  ...newYouTubeBookmarkFormState,
  // TODO - add dark theme mode overrides here
} as TStateForm;
