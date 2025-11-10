import { clone_with_descriptors, t } from '../../business.logic';
import { register } from '../../business.logic/registry';
import * as C from '@tuber/shared';

register('state', '4', C.$4_STATE_KEY);
/** Form for creating a new YouTube video bookmark @id 4 */
const newYouTubeBookmarkFormState = {
  '_id': '4',
  '_key': C.$4_STATE_KEY,
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
              get 'label'() { return t('261', 'Start'); },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': {
                'readOnly': true,
                'sx': { 'backgroundColor': 'grey.300' }
              },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('262', C.START_SECONDS_REQUIRED_MESSAGE); },
              }
            },
            {
              'type': 'number',
              'name': 'end_seconds',
              get 'label'() { return t('263', 'Length'); },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'disabled': true }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('264', 'Video ID'); },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('265', 'Platform'); },
              'props': {
                'sx': { 'width': 240 },
              },
              'inputProps': { 'readOnly': true }
            },
          ]
        },
        {
          'type': 'textfield',
          'name': 'title',
          get 'label'() { return t('266', 'Title'); },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('267', C.TITLE_REQUIRED_MESSAGE); },
            'maxLength': C.TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('268', C.TITLE_MAX_LENGTH_MESSAGE); },
            get 'invalidationRegex'() { return t('269', '[/#.]'); },
            get 'invalidationMessage'() { return t('270', `Characters not allowed: '/', '#', '.'`); }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('271', 'Note'); },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('272', C.NOTE_MAX_LENGTH_MESSAGE); }
          }
        }
      ]
    },
  ]
} as C.TStateForm;

export default newYouTubeBookmarkFormState;

export const $4DarkThemeMode: C.TStateForm = (() => {
  const base = clone_with_descriptors(newYouTubeBookmarkFormState);
  return base;
})();
