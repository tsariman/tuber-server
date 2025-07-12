import { r } from 'src/business.logic';
import { TStateForm } from '../../common.types';
import Config from '../../config';
import * as C from '../../constants';

Config.register('state', '5', C.$5_STATE_KEY);
/** Form for editing an existing YouTube bookmark. @id 5 */
const editYouTubeBookmarkFormState = {
  '_id': '5',
  '_key': C.$5_STATE_KEY,
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
              'label': r('172', 'Start'),
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                'requiredMessage': r('192', C.START_SECONDS_REQUIRED_MESSAGE),
              }
            },
            {
              'type': 'number',
              'name': 'end_seconds',
              'label': r('173', 'Length'),
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'disabled': true }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              'label': r('174', 'Video ID'),
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': r('175', 'Platform'),
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
          'label': r('176', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': r('193', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': r('194', C.TITLE_MAX_LENGTH),
            'maxLengthMessage': r('195', C.TITLE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('177', 'Note'),
          'props': {
            'multiline': true,
            'rows': r('196', C.NOTE_FIELD_ROWS)
          },
          'has': {
            'maxLength': r('197', C.NOTE_MAX_LENGTH),
            'maxLengthMessage': r('198', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'single_switch',
          'name': 'is_published',
          'label': r('178', 'Published'),
          'has': {
            'helperText': r('199', C.PUBLISHED_HELPER_TEXT)
          }
        }
      ]
    },
  ]
} as TStateForm;

export default editYouTubeBookmarkFormState;

export const $5DarkThemeMode = {
  ...editYouTubeBookmarkFormState,
  // TODO - add dark theme mode overrides here
} as TStateForm;
