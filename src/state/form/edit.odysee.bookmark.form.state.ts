import { register } from '../../business.logic/registry';
import * as C from '../../constants';
import { TStateForm } from '../../common.types';
import { r } from 'src/business.logic';

register('state', '18', C.$18_STATE_KEY);
/** Form for creating a edit odysee video bookmark @id 18 */
const editOdyseeBookmarkFormState = {
  '_id': '18',
  '_key': C.$18_STATE_KEY,
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
              'label': r('87', 'Start'),
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                'requiredMessage': r('109', C.START_SECONDS_REQUIRED_MESSAGE),
              }
            },
            {
              'type': 'textfield',
              'name': 'slug',
              'label': r('88', 'Video URL Slug'),
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': r('89', 'Platform'),
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
          'label': r('90', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': r('110', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': r('111', C.TITLE_MAX_LENGTH),
            'maxLengthMessage': r('112', C.TITLE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('91', 'Note'),
          'props': {
            'multiline': true,
            'rows': r('113', C.NOTE_FIELD_ROWS)
          },
          'has': {
            'maxLength': r('114', C.NOTE_MAX_LENGTH),
            'maxLengthMessage': r('115', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'single_switch',
          'name': 'is_published',
          'label': r('92', 'Published'),
          'has': {
            'helperText': r('116', C.PUBLISHED_HELPER_TEXT)
          }
        }
      ]
    },
  ]
} as TStateForm;

export default editOdyseeBookmarkFormState;

export const $18DarkThemeMode = {
  ...editOdyseeBookmarkFormState,
  // TODO - add dark theme overrides
} as TStateForm;
