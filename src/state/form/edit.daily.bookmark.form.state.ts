import { r } from 'src/business.logic';
import { TStateForm } from '../../common.types';
import Config from '../../config';
import * as C from '../../constants';

Config.register('state', '20', C.$20_STATE_KEY);
/** Form for editing an existing Dailymotion bookmark. @id 20 */
const editDailyBookmarkFormState = {
  '_id': '20',
  '_key': C.$20_STATE_KEY,
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
              'label': r('73', 'Start'),
              'props': {
                'sx': { 'width': 240, },
                'helperText': r('74', 'time in second(s)'),
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                'requiredMessage': r('93', C.START_SECONDS_REQUIRED_MESSAGE),
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              'label': r('75', 'Video ID'),
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': r('76', 'Platform'),
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
          'label': r('77', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': r('94', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': r('95', C.TITLE_MAX_LENGTH),
            'maxLengthMessage': r('96', C.TITLE_MAX_LENGTH_MESSAGE),
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('78', 'Note'),
          'props': {
            'multiline': true,
            'rows': r('97', C.NOTE_FIELD_ROWS)
          },
          'has': {
            'maxLength': r('98', C.NOTE_MAX_LENGTH),
            'maxLengthMessage': r('99', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'single_switch',
          'name': 'is_published',
          'label': r('79', 'Published'),
          'has': {
            'helperText': r('100', C.PUBLISHED_HELPER_TEXT)
          }
        }
      ]
    },
  ]
} as TStateForm

export default editDailyBookmarkFormState

export const $20DarkThemeMode = {
  ...editDailyBookmarkFormState,
} as TStateForm
