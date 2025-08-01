import { r } from 'src/business.logic';
import { TStateForm } from '../../common.types';
import { register } from '../../business.logic/registry';
import * as C from '../../constants';

register('state', '12', C.$12_STATE_KEY);
/** Form for creating a new Vimeo video bookmark @id 12 */
const newVimeoBookmarkFormState = {
  '_id': '12',
  '_key': C.$12_STATE_KEY,
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
              'label': r('252', 'Start'),
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                'requiredMessage': r('253', C.START_SECONDS_REQUIRED_MESSAGE),
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              'label': r('254', 'Video ID'),
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': r('255', 'Platform'),
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
          'label': r('256', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': r('257', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': C.TITLE_MAX_LENGTH,
            'maxLengthMessage': r('258', C.TITLE_MAX_LENGTH_MESSAGE),
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('259', 'Note'),
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            'maxLengthMessage': r('260', C.NOTE_MAX_LENGTH_MESSAGE),
          }
        }
      ]
    },
  ]
} as TStateForm;

export default newVimeoBookmarkFormState;

export const $12DarkThemeMode = {
  ...newVimeoBookmarkFormState,
  // TODO - add dark theme mode overrides here
} as TStateForm;