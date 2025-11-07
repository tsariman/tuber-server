import { clone_with_descriptors, t } from '../../business.logic';
import { TStateForm } from '@tuber/shared';
import { register } from '../../business.logic/registry';
import * as C from '@tuber/shared';

register('state', '5', C.$5_STATE_KEY);
/** Form for editing an existing YouTube bookmark. @id 5 */
const editYouTubeBookmarkFormState = {
  '_id': '5',
  '_key': C.$5_STATE_KEY,
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
              get 'label'() { return t('172', 'Start'); },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('192', C.START_SECONDS_REQUIRED_MESSAGE); },
              }
            },
            {
              'type': 'number',
              'name': 'end_seconds',
              get 'label'() { return t('173', 'Length'); },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'disabled': true }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('174', 'Video ID'); },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('175', 'Platform'); },
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
          get 'label'() { return t('176', 'Title'); },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('193', C.TITLE_REQUIRED_MESSAGE); },
            'maxLength': C.TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('195', C.TITLE_MAX_LENGTH_MESSAGE); }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('177', 'Note'); },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('198', C.NOTE_MAX_LENGTH_MESSAGE); }
          }
        },
        {
          'type': 'single_switch',
          'name': 'is_published',
          get 'label'() { return t('178', 'Published'); },
          'has': {
            get 'helperText'() { return t('199', C.PUBLISHED_HELPER_TEXT); }
          }
        }
      ]
    },
  ]
} as TStateForm;

export default editYouTubeBookmarkFormState;

export const $5DarkThemeMode = (() => {
  const base = clone_with_descriptors(editYouTubeBookmarkFormState);
  return base;
})();
