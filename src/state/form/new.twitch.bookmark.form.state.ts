import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import {
  NOTE_FIELD_ROWS,
  NOTE_MAX_LENGTH,
  NOTE_MAX_LENGTH_MESSAGE,
  START_SECONDS_REQUIRED_MESSAGE,
  TITLE_MAX_LENGTH,
  TITLE_MAX_LENGTH_MESSAGE,
  TITLE_REQUIRED_MESSAGE,
  type TStateForm
} from '@tuber/shared'
import STATE_KEY from '../../business.logic/state.key'

const $38 = STATE_KEY['38']

register('state', '38', $38)
/** Form for creating a new Twitch video bookmark @id 38 */
export const newTwitchBookmarkFormState = {
  '_id': '38',
  '_key': $38,
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
                get 'requiredMessage'() { return t('232', START_SECONDS_REQUIRED_MESSAGE) },
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
            get 'requiredMessage'() { return t('236', TITLE_REQUIRED_MESSAGE) },
            'maxLength': TITLE_MAX_LENGTH, // [TODO] Make a configuration.
            get 'maxLengthMessage'() { return t('237', TITLE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('238', 'Note') },
          'props': {
            'multiline': true,
            'rows': NOTE_FIELD_ROWS // [TODO] Make a configuration.
          },
          'has': {
            'maxLength': NOTE_MAX_LENGTH, // [TODO] Make a configuration.
            get 'maxLengthMessage'() { return t('239', NOTE_MAX_LENGTH_MESSAGE) }
          }
        }
      ]
    },
  ]
} as TStateForm

export default newTwitchBookmarkFormState

export const $38DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newTwitchBookmarkFormState)
  return base
})()