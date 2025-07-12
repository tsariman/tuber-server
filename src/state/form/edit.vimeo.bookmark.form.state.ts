import { r } from 'src/business.logic';
import { TStateForm } from '../../common.types';
import Config from '../../config';
import * as C from '../../constants';

Config.register('state', '13', C.$13_STATE_KEY);
/** Form for editing an existing Vimeo bookmark. @id 13 */
const editVimeoBookmarkFormState = {
  '_id': '13',
  '_key': C.$13_STATE_KEY,
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
              'label': r('158', 'Start'),
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                'requiredMessage': r('159', C.START_SECONDS_REQUIRED_MESSAGE),
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              'label': r('160', 'Video ID'),
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': r('161', 'Platform'),
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
          'label': r('162', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': r('163', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': r('164', C.TITLE_MAX_LENGTH),
            'maxLengthMessage': r('165', C.TITLE_MAX_LENGTH_MESSAGE),
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('166', 'Note'),
          'props': {
            'multiline': true,
            'rows': r('167', C.NOTE_FIELD_ROWS)
          },
          'has': {
            'maxLength': r('168', C.NOTE_MAX_LENGTH),
            'maxLengthMessage': r('169', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'single_switch',
          'name': 'is_published',
          'label': r('170', 'Published'),
          'has': {
            'helperText': r('171', C.PUBLISHED_HELPER_TEXT)
          }
        }
      ]
    },
  ]
} as TStateForm;

export default editVimeoBookmarkFormState;

export const $13DarkThemeMode = {
  ...editVimeoBookmarkFormState,
  // TODO - add dark theme mode overrides here
} as TStateForm
