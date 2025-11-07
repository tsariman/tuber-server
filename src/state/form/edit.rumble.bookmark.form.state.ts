import { clone_with_descriptors, t } from '../../business.logic';
import { TStateForm } from '../../shared';
import { register } from '../../business.logic/registry';
import * as C from '@tuber/shared';

register('state', '10', C.$10_STATE_KEY);
/** Form for creating a edit rumble video bookmark @id 10 */
const editRumbleBookmarkFormState = {
  '_id': '10',
  '_key': C.$10_STATE_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textfield',
          'name': 'slug',
          get 'label'() { return t('117', 'Video URL Slug'); },
          'props': {
            'fullWidth': true,
            'variant': 'filled'
          },
          'inputProps': { 'readOnly': true }
        },
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
              get 'label'() { return t('118', 'Start'); },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('119', C.START_SECONDS_REQUIRED_MESSAGE); },
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('120', 'Video ID'); },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('121', 'Platform'); },
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
          get 'label'() { return t('122', 'Title'); },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('123', C.TITLE_REQUIRED_MESSAGE); },
            'maxLength': C.TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('125', C.TITLE_MAX_LENGTH_MESSAGE); }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('126', 'Note'); },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('129', C.NOTE_MAX_LENGTH_MESSAGE); }
          }
        },
        {
          'type': 'single_switch',
          'name': 'is_published',
          get 'label'() { return t('130', 'Published'); },
          'has': {
            get 'helperText'() { return t('131', C.PUBLISHED_HELPER_TEXT); }
          }
        }
      ]
    },
  ]
} as TStateForm;

export default editRumbleBookmarkFormState;

export const $10DarkThemeMode = (() => {
  const base = clone_with_descriptors(editRumbleBookmarkFormState);
  return base;
})();
