import { r } from 'src/business.logic';
import { TStateForm } from '../../common.types';
import Config from '../../config';
import * as C from '../../constants';

Config.register('state', '28', C.$28_STATE_KEY);
/** Form for creating a new unknown video bookmark @id 28 */
const newUnknownBookmarkFormState = {
  '_id': '28',
  '_key': C.$28_STATE_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textfield',
          'name': 'url',
          'label': r('240', 'Video URL'),
          'props': {
            'fullWidth': true,
            'variant': 'filled'
          },
          'inputProps': { 'readOnly': true },
          'has': {
            'required': true, // [TODO] make a configuration.
            'requiredMessage': r('241', 'Where did that URL go?'),
          }
        },
        {
          'type': 'textfield',
          'name': 'embed_url',
          'label': r('242', 'Embed IFRAME URL'),
          'props': {
            'fullWidth': true,
          },
          'has': {
            'required': true,
            'requiredMessage': r('243', C.EMBED_URL_MESSAGE),
          }
        },
        {
          'type': 'html',
          'has': {
            'content': `
              <span style="font-size:1.2rem;color:blue">
                Note:
              </span>
              ${r('244', 'Don\'t hesitate to paste-in the entire embed HTML code above. Bare in\
              mind, some embed URLs need to be customized for them to work.')}
            `
          }
        },
        {
          'type': 'textfield',
          'name': 'thumbnail_url',
          'label': r('245', 'Thumbnail URL'),
          'props': {
            'fullWidth': true,
            // 'variant': 'filled'
          },
          // 'inputProps': { 'readOnly': true },
        },
        {
          'type': 'textfield',
          'name': 'title',
          'label': r('246', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': r('246', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': C.TITLE_MAX_LENGTH, // [TODO] make a configuration.
            'maxLengthMessage': r('247', C.TITLE_MAX_LENGTH_MESSAGE),
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('248', 'Note'),
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS // [TODO] Make a configuration.
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            'maxLengthMessage': r('249', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        }
      ]
    },
  ]
} as TStateForm;

export default newUnknownBookmarkFormState;

export const $28DarkThemeMode = {
  ...newUnknownBookmarkFormState,
  // TODO - add dark theme mode overrides here
} as TStateForm;