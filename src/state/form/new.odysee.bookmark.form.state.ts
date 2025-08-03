import { r } from 'src/business.logic';
import { TStateForm } from '../../shared';
import { register } from '../../business.logic/registry';
import * as C from '../../constants.server';

register('state', '17', C.$17_STATE_KEY);
/** Form for creating a new odysee video bookmark @id 17 */
const newOdyseeBookmarkFormState = {
  '_id': '17',
  '_key': C.$17_STATE_KEY,
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
              'label': r('212', 'Start'),
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true, // [TODO] Make a configuration.
                'requiredMessage': r('213', C.START_SECONDS_REQUIRED_MESSAGE),
              }
            },
            {
              'type': 'textfield',
              'name': 'slug',
              'label': r('214', 'Video URL Slug'),
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              'label': r('215', 'Platform'),
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
          'label': r('216', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true, // [TODO] Make a configuration.
            'requiredMessage': r('217', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': C.TITLE_MAX_LENGTH, // [TODO] Make a configuration.
            'maxLengthMessage': r('218', C.TITLE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('219', 'Note'),
          'props': {
            'multiline': true,  // [TODO] Make a configuration.
            'rows': C.NOTE_FIELD_ROWS  // [TODO] Make a configuration.
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,  // [TODO] Make a configuration.
            'maxLengthMessage': r('220', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        }
      ]
    },
  ]
} as TStateForm;

export default newOdyseeBookmarkFormState;

export const $17DarkThemeMode = {
  ...newOdyseeBookmarkFormState,
  // TODO - add dark theme mode overrides here
} as TStateForm;
