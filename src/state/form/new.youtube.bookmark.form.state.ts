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

const $4 = STATE_KEY['4']

register('state', '4', $4)
/** Form for creating a new YouTube video bookmark @id 4 */
export const newYouTubeBookmarkFormState = {
  '_id': '4',
  '_key': $4,
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
              get 'label'() { return t('261', 'Start') },
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
                get 'requiredMessage'() { return t('262', START_SECONDS_REQUIRED_MESSAGE) },
              }
            },
            {
              'type': 'number',
              'name': 'end_seconds',
              get 'label'() { return t('263', 'Length') },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'disabled': true }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('264', 'Video ID') },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('265', 'Platform') },
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
          get 'label'() { return t('266', 'Title') },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('267', TITLE_REQUIRED_MESSAGE) },
            'maxLength': TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('268', TITLE_MAX_LENGTH_MESSAGE) },
            get 'invalidationRegex'() { return t('269', '[/#.]') },
            get 'invalidationMessage'() { return t('270', `Characters not allowed: '/', '#', '.'`) }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('271', 'Note') },
          'props': {
            'multiline': true,
            'rows': NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('272', NOTE_MAX_LENGTH_MESSAGE) }
          }
        }
      ]
    },
  ]
} as TStateForm

export default newYouTubeBookmarkFormState

export const $4DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newYouTubeBookmarkFormState)
  return base
})()
