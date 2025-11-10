import { clone_with_descriptors, t } from '../../business.logic';
import * as C from '@tuber/shared';
import { register } from '../../business.logic/registry';

register('state', '20', C.$20_STATE_KEY);
/** Form for editing an existing Dailymotion bookmark. @id 20 */
const editDailyBookmarkFormState = {
  '_id': '20',
  '_key': C.$20_STATE_KEY,
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
              get 'label'() { return t('73', 'Start'); },
              'props': {
                'sx': { 'width': 240, },
                get 'helperText'() { return t('74', 'time in second(s)'); },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('93', C.START_SECONDS_REQUIRED_MESSAGE); },
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('75', 'Video ID'); },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('76', 'Platform'); },
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
          get 'label'() { return t('77', 'Title'); },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('94', C.TITLE_REQUIRED_MESSAGE); },
            'maxLength': C.TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('96', C.TITLE_MAX_LENGTH_MESSAGE); },
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('78', 'Note'); },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('99', C.NOTE_MAX_LENGTH_MESSAGE); }
          }
        },
        {
          'type': 'single_switch',
          'name': 'is_published',
          get 'label'() { return t('79', 'Published'); },
          'has': {
            get 'helperText'() { return t('100', C.PUBLISHED_HELPER_TEXT); }
          }
        }
      ]
    },
  ]
} as C.TStateForm;

export default editDailyBookmarkFormState;

export const $20DarkThemeMode = (() => {
  const base = clone_with_descriptors(editDailyBookmarkFormState);
  return base;
})();