import { r } from 'src/business.logic';
import { TStateForm } from '../../common.types';
import Config from '../../config';
import * as C from '../../constants';

Config.register('state', '29', C.$29_STATE_KEY);
/** Form for editing an existing unknown platform video bookmark @id 29 */
const editUnknownBookmarkFormState = {
  '_id': '29',
  '_key': C.$29_STATE_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textfield',
          'name': 'url',
          'label': r('146', 'Video URL'),
          'props': {
            'fullWidth': true,
            'variant': 'filled'
          },
          'inputProps': { 'readOnly': true }
        },
        {
          'type': 'textfield',
          'name': 'embed_url',
          'label': r('147', 'Embed IFRAME URL'),
          'props': {
            'fullWidth': true,
            'variant': 'filled'
          },
          'inputProps': { 'readOnly': true }
        },
        {
          'type': 'textfield',
          'name': 'thumbnail_url',
          'label': r('148', 'Thumbnail URL'),
          'props': {
            'fullWidth': true,
            // 'variant': 'filled'
          },
          // 'inputProps': { 'readOnly': true },
          'has': {
            'required': true,
            'requiredMessage': r('149', 'Where did that thumbnail URL go?'),
          }
        },
        {
          'type': 'textfield',
          'name': 'title',
          'label': r('150', 'Title'),
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': r('151', C.TITLE_REQUIRED_MESSAGE),
            'maxLength': r('152', C.TITLE_MAX_LENGTH),
            'maxLengthMessage': r('153', C.TITLE_MAX_LENGTH_MESSAGE)
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': r('154', 'Note'),
          'props': {
            'multiline': true,
            'rows': r('155', C.NOTE_FIELD_ROWS)
          },
          'has': {
            'maxLength': r('156', C.NOTE_MAX_LENGTH),
            'maxLengthMessage': r('157', C.NOTE_MAX_LENGTH_MESSAGE)
          }
        }
      ]
    },
  ]
} as TStateForm

export default editUnknownBookmarkFormState

export const $29DarkThemeMode = {
  ...editUnknownBookmarkFormState,
  // TODO - add dark theme overrides here
} as TStateForm
