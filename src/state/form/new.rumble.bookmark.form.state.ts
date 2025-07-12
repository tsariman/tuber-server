import { r } from 'src/business.logic';
import { TStateForm } from '../../common.types';
import Config from '../../config';
import * as C from '../../constants';

Config.register('state', '9', C.$9_STATE_KEY);
/** Form for creating a new rumble video bookmark @id 9 */
const newRumbleBookmarkFormState = {
  '_id': '9',
  '_key': C.$9_STATE_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textfield',
          'name': 'slug',
          'label': r('221', 'Video URL Slug'),
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
              'label': r('222', 'Start'),
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true, // [TODO] Make a configuration.
                'requiredMessage': r('223', C.START_SECONDS_REQUIRED_MESSAGE),
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              'label': r('224', 'Video ID will be resolved eventually...'),
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'disabled': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': r('225', 'Platform'),
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
          'label': r('226', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true, // [TODO] Make a configuration.
            'requiredMessage': r('227', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': C.TITLE_MAX_LENGTH, // [TODO] Make a configuration.
            'maxLengthMessage': r('228', C.TITLE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('229', 'Note'),
          'props': {
            'multiline': true, // [TODO] Make a configuration.
            'rows': C.NOTE_FIELD_ROWS, // [TODO] Make a configuration.
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH, // [TODO] Make a configuration.
            'maxLengthMessage': r('230', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        }
      ]
    },
  ]
} as TStateForm;

export default newRumbleBookmarkFormState;

export const $9DarkThemeMode = {
  ...newRumbleBookmarkFormState,
  // TODO - add dark theme mode overrides here
} as TStateForm;
