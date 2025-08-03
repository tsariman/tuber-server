import { r } from 'src/business.logic';
import { TStateForm } from '../../shared';
import { register } from '../../business.logic/registry';
import * as C from '../../constants.server';

register('state', '38', C.$38_STATE_KEY);
/** Form for creating a new Twitch video bookmark @id 38 */
const newTwitchBookmarkFormState = {
  '_id': '38',
  '_key': C.$38_STATE_KEY,
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
              'label': r('231', 'Start'),
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true, // [TODO] Make a configuration.
                'requiredMessage': r('232', C.START_SECONDS_REQUIRED_MESSAGE),
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              'label': r('233', 'Video ID'),
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': r('234', 'Platform'),
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
          'label': r('235', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': r('236', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': C.TITLE_MAX_LENGTH, // [TODO] Make a configuration.
            'maxLengthMessage': r('237', C.TITLE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('238', 'Note'),
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS // [TODO] Make a configuration.
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH, // [TODO] Make a configuration.
            'maxLengthMessage': r('239', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        }
      ]
    },
  ]
} as TStateForm;

export default newTwitchBookmarkFormState;

export const $38DarkThemeMode = {
  ...newTwitchBookmarkFormState,
  // TODO - add dark theme mode overrides here
} as TStateForm;