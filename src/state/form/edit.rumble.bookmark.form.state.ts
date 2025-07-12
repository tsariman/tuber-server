import { r } from 'src/business.logic';
import { TStateForm } from '../../common.types';
import Config from '../../config';
import * as C from '../../constants';

Config.register('state', '10', C.$10_STATE_KEY);
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
          'label': r('117', 'Video URL Slug'),
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
              'label': r('118', 'Start'),
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                'requiredMessage': r('119', C.START_SECONDS_REQUIRED_MESSAGE),
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              'label': r('120', 'Video ID'),
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': r('121', 'Platform'),
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
          'label': r('122', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': r('123', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': r('124', C.TITLE_MAX_LENGTH),
            'maxLengthMessage': r('125', C.TITLE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('126', 'Note'),
          'props': {
            'multiline': true,
            'rows': r('127', C.NOTE_FIELD_ROWS)
          },
          'has': {
            'maxLength': r('128', C.NOTE_MAX_LENGTH),
            'maxLengthMessage': r('129', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'single_switch',
          'name': 'is_published',
          'label': r('130', 'Published'),
          'has': {
            'helperText': r('131', C.PUBLISHED_HELPER_TEXT)
          }
        }
      ]
    },
  ]
} as TStateForm;

export default editRumbleBookmarkFormState;

export const $10DarkThemeMode = {
  ...editRumbleBookmarkFormState,
  // TODO - add dark theme mode overrides
} as TStateForm;
