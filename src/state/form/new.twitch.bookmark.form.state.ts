import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import * as C from '@tuber/shared'

register('state', '38', C.$38_STATE_KEY)
/** Form for creating a new Twitch video bookmark @id 38 */
export const newTwitchBookmarkFormState = {
  '_id': '38',
  '_key': C.$38_STATE_KEY,
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
              get 'label'() { return t('231', 'Start') },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true, // [TODO] Make a configuration.
                get 'requiredMessage'() { return t('232', C.START_SECONDS_REQUIRED_MESSAGE) },
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('233', 'Video ID') },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('234', 'Platform') },
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
          get 'label'() { return t('235', 'Title') },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('236', C.TITLE_REQUIRED_MESSAGE) },
            'maxLength': C.TITLE_MAX_LENGTH, // [TODO] Make a configuration.
            get 'maxLengthMessage'() { return t('237', C.TITLE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('238', 'Note') },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS // [TODO] Make a configuration.
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH, // [TODO] Make a configuration.
            get 'maxLengthMessage'() { return t('239', C.NOTE_MAX_LENGTH_MESSAGE) }
          }
        }
      ]
    },
  ]
} as C.TStateForm

export default newTwitchBookmarkFormState

export const $38DarkThemeMode: C.TStateForm = (() => {
  const base = clone_with_descriptors(newTwitchBookmarkFormState)
  return base
})()