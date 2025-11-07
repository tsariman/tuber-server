import { clone_with_descriptors, t } from '../../business.logic';
import { TStateForm } from '@tuber/shared';
import { register } from '../../business.logic/registry';
import * as C from '@tuber/shared';

register('state', '29', C.$29_STATE_KEY);
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
          get 'label'() { return t('146', 'Video URL'); },
          'props': {
            'fullWidth': true,
            'variant': 'filled'
          },
          'inputProps': { 'readOnly': true }
        },
        {
          'type': 'textfield',
          'name': 'embed_url',
          get 'label'() { return t('147', 'Embed IFRAME URL'); },
          'props': {
            'fullWidth': true,
            'variant': 'filled'
          },
          'inputProps': { 'readOnly': true }
        },
        {
          'type': 'textfield',
          'name': 'thumbnail_url',
          get 'label'() { return t('148', 'Thumbnail URL'); },
          'props': {
            'fullWidth': true,
            // 'variant': 'filled'
          },
          // 'inputProps': { 'readOnly': true },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('149', 'Where did that thumbnail URL go?'); },
          }
        },
        {
          'type': 'textfield',
          'name': 'title',
          get 'label'() { return t('150', 'Title'); },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('151', C.TITLE_REQUIRED_MESSAGE); },
            'maxLength': C.TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('153', C.TITLE_MAX_LENGTH_MESSAGE); }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('154', 'Note'); },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('157', C.NOTE_MAX_LENGTH_MESSAGE); }
          }
        }
      ]
    },
  ]
} as TStateForm

export default editUnknownBookmarkFormState

export const $29DarkThemeMode = (() => {
  const base = clone_with_descriptors(editUnknownBookmarkFormState);
  return base;
})();
