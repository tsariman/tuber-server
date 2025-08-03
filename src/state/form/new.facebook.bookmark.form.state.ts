import { r } from 'src/business.logic';
import { TStateForm } from '../../shared';
import { register } from '../../business.logic/registry';
import * as C from '../../constants.server';

register('state', '24', C.$24_STATE_KEY);
/** Form for creating a new facebook video bookmark @id 24 */
const newFacebookBookmarkFormState = {
  '_id': '24',
  '_key': C.$24_STATE_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textfield',
          'name': 'url',
          'label': r('200', 'Link'),
          'props': {
            'fullWidth': true,
            'variant': 'filled'
          },
          'inputProps': { 'readOnly': true },
          'has': {
            'required': true,
            'requiredMessage': r('201', C.URL_REQUIRED_MESSAGE),
          }
        },
        {
          'type': 'textfield',
          'name': 'embed_url',
          'label': r('202', 'Embed HTML Code'),
          'props': {
            'fullWidth': true,
          },
          'has': {
            'required': true,
            'requiredMessage': r('203', 'We need the embed HTML code'),
          }
        },
        {
          'type': 'textfield',
          'name': 'title',
          'label': r('204', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': r('205', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': r('206', C.TITLE_MAX_LENGTH),
            'maxLengthMessage': r('207', C.TITLE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('208', 'Note'),
          'props': {
            'multiline': true,
            'rows': r('209', C.NOTE_FIELD_ROWS)
          },
          'has': {
            'maxLength': r('210', C.NOTE_MAX_LENGTH),
            'maxLengthMessage': r('211', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        }
      ]
    },
  ]
} as TStateForm;

export default newFacebookBookmarkFormState;

export const $24DarkThemeMode = {
  ...newFacebookBookmarkFormState,
  // TODO - add dark theme mode overrides here
} as TStateForm;
