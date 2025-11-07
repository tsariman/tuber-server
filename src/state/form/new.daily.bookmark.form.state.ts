import { clone_with_descriptors, t } from '../../business.logic';
import { TStateForm } from '../../shared';
import { register } from '../../business.logic/registry';
import * as C from '@tuber/shared';

register('state', '19', C.$19_STATE_KEY);
/** Form for creating a new Dailymotion video bookmark @id 19 */
const newDailyBookmarkFormState = {
  '_id': '19',
  '_key': C.$19_STATE_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'html',
          'has': {
            'content': `
              <span style="font-size:1.2rem;color:blue">
                Note:
              </span>
              With Dailymotion, you must insert the start time by appending
              e.g. <code>?start=1m8s</code> to the video URL.
            `
          }
        },
        {
          'type': 'stack',
          'props': {
            'direction': 'row',
            'spacing': 1
          },
          'items': [
            {
              'type': 'textfield',
              'name': 'start_time',
              get 'label'() { return t('179', 'Start'); },
              'props': {
                'sx': { 'width': 240 },
                get 'helperText'() { return t('180', 'Start time e.g. 1m8s'); },
              },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('181', C.START_SECONDS_REQUIRED_MESSAGE); },
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('182', 'Video ID'); },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('183', 'Platform'); },
              'props': {
                'sx': { 'width': 240, },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
          ]
        },
        {
          'type': 'textfield',
          'name': 'title',
          get 'label'() { return t('184', 'Title'); },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('185', C.TITLE_REQUIRED_MESSAGE); },
            'maxLength': C.TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('187', C.TITLE_MAX_LENGTH_MESSAGE); }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('188', 'Note'); },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('189', C.NOTE_MAX_LENGTH_MESSAGE); }
          }
        }
      ]
    },
  ]
} as TStateForm;

export default newDailyBookmarkFormState;

export const $19DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newDailyBookmarkFormState);
  return base;
})();
