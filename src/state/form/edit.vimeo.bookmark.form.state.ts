import { clone_with_descriptors, t } from '../../business.logic';
import { register } from '../../business.logic/registry';
import * as C from '@tuber/shared';

register('state', '13', C.$13_STATE_KEY);
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
              get 'label'() { return t('158', 'Start'); },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('159', C.START_SECONDS_REQUIRED_MESSAGE); },
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('160', 'Video ID'); },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('161', 'Platform'); },
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
          get 'label'() { return t('162', 'Title'); },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('163', C.TITLE_REQUIRED_MESSAGE); },
            'maxLength': C.TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('165', C.TITLE_MAX_LENGTH_MESSAGE); },
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('166', 'Note'); },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('169', C.NOTE_MAX_LENGTH_MESSAGE); }
          }
        },
        {
          'type': 'single_switch',
          'name': 'is_published',
          get 'label'() { return t('170', 'Published'); },
          'has': {
            get 'helperText'() { return t('171', C.PUBLISHED_HELPER_TEXT); }
          }
        }
      ]
    },
  ]
} as C.TStateForm;

export default editVimeoBookmarkFormState;

export const $13DarkThemeMode = (() => {
  const base = clone_with_descriptors(editVimeoBookmarkFormState);
  return base;
})();
