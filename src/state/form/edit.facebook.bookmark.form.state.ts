import { r } from 'src/business.logic';
import { TStateForm } from '../../common.types';
import Config from '../../config';
import * as C from '../../constants';

Config.register('state', '25', C.$25_STATE_KEY);
/** Form for creating a edit facebook video bookmark @id 25 */
const editFacebookBookmarkFormState = {
  '_id': '25',
  '_key': C.$25_STATE_KEY,
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
              'label': r('80', 'Start'),
              'props': {
                'sx': { 'width': 160 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                'requiredMessage': r('101', C.START_SECONDS_REQUIRED_MESSAGE),
              }
            },
            {
              'type': 'textfield',
              'name': 'author',
              'label': r('81', 'Author'),
              'props': {
                'fullWidth': true,
                'variant': 'filled',
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              'label': r('82', 'Video ID'),
              'props': {
                'sx': { 'width': 320 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': r('83', 'Platform'),
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
          'label': r('84', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': r('102', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': r('103', C.TITLE_MAX_LENGTH),
            'maxLengthMessage': r('104', C.TITLE_MAX_LENGTH_MESSAGE),
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('85', 'Note'),
          'props': {
            'multiline': true,
            'rows': r('105', C.NOTE_FIELD_ROWS)
          },
          'has': {
            'maxLength': r('106', C.NOTE_MAX_LENGTH),
            'maxLengthMessage': r('107', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'single_switch',
          'name': 'is_published',
          'label': r('86', 'Published'),
          'has': {
            'helperText': r('108', C.PUBLISHED_HELPER_TEXT)
          }
        }
      ]
    },
  ]
} as TStateForm;

export default editFacebookBookmarkFormState;

export const $25DarkThemeMode = {
  ...editFacebookBookmarkFormState,
  // TODO: Add dark theme overrides here
} as TStateForm;
