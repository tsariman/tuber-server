import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import { NOTE_FIELD_ROWS, NOTE_MAX_LENGTH, NOTE_MAX_LENGTH_MESSAGE, START_SECONDS_REQUIRED_MESSAGE, TITLE_MAX_LENGTH, TITLE_MAX_LENGTH_MESSAGE, TITLE_REQUIRED_MESSAGE, TStateForm } from '@tuber/shared'
import STATE_KEY from '../../business.logic/state.key'

const $19 = STATE_KEY['19']

register('state', '19', $19)
/** Form for creating a new Dailymotion video bookmark @id 19 */
export const newDailyBookmarkFormState = {
  '_id': '19',
  '_key': $19,
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
              get 'label'() { return t('179', 'Start') },
              'props': {
                'sx': { 'width': 240 },
                get 'helperText'() { return t('180', 'Start time e.g. 1m8s') },
              },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('181', START_SECONDS_REQUIRED_MESSAGE) },
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('182', 'Video ID') },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('183', 'Platform') },
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
          get 'label'() { return t('184', 'Title') },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('185', TITLE_REQUIRED_MESSAGE) },
            'maxLength': TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('187', TITLE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('188', 'Note') },
          'props': {
            'multiline': true,
            'rows': NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('189', NOTE_MAX_LENGTH_MESSAGE) }
          }
        }
      ]
    },
  ]
} as TStateForm

export default newDailyBookmarkFormState

export const $19DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newDailyBookmarkFormState)
  return base
})()
