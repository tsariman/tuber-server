import { clone_with_descriptors, t } from '../../business.logic';
import { TStateForm } from '../../shared';
import { register } from '../../business.logic/registry';
import * as C from '@tuber/shared';

register('state', '28', C.$28_STATE_KEY);
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
          get 'label'() { return t('240', 'Video URL'); },
          'props': {
            'fullWidth': true,
            'variant': 'filled'
          },
          'inputProps': { 'readOnly': true },
          'has': {
            'required': true, // [TODO] make a configuration.
            get 'requiredMessage'() { return t('241', 'Where did that URL go?'); },
          }
        },
        {
          'type': 'textfield',
          'name': 'embed_url',
          get 'label'() { return t('242', 'Embed IFRAME URL'); },
          'props': {
            'fullWidth': true,
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('243', C.EMBED_URL_MESSAGE); },
          }
        },
        {
          'type': 'html',
          'has': {
            'content': `
              <span style="font-size:1.2rem;color:blue">
                Note:
              </span>
              ${t('244', 'Don\'t hesitate to paste-in the entire embed HTML code above. Bare in\
              mind, some embed URLs need to be customized for them to work.')}
            `
          }
        },
        {
          'type': 'textfield',
          'name': 'thumbnail_url',
          get 'label'() { return t('245', 'Thumbnail URL'); },
          'props': {
            'fullWidth': true,
            // 'variant': 'filled'
          },
          // 'inputProps': { 'readOnly': true },
        },
        {
          'type': 'textfield',
          'name': 'title',
          get 'label'() { return t('246', 'Title'); },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('246', C.TITLE_REQUIRED_MESSAGE); },
            'maxLength': C.TITLE_MAX_LENGTH, // [TODO] make a configuration.
            get 'maxLengthMessage'() { return t('247', C.TITLE_MAX_LENGTH_MESSAGE); },
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('248', 'Note'); },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS // [TODO] Make a configuration.
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('249', C.NOTE_MAX_LENGTH_MESSAGE); }
          }
        }
      ]
    },
  ]
} as TStateForm;

export default newUnknownBookmarkFormState;

export const $28DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newUnknownBookmarkFormState);
  return base;
})();
