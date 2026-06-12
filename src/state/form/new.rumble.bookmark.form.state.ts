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
  TStateForm
} from '@tuber/shared'
import STATE_KEY from '../../business.logic/state.key'

const $9 = STATE_KEY['9']

register('state', '9', $9)
/** Form for creating a new rumble video bookmark @id 9 */
export const newRumbleBookmarkFormState = {
  '_id': '9',
  '_key': $9,
  'items': [
    {
      'type': 'stack',
      'props': {
        'spacing': 2,
        'sx': { 'pt': 1 }
      },
      'items': [
        {
          'type': 'textfield',
          'name': 'slug',
          get 'label'() { return t('221', 'Video URL Slug') },
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
              get 'label'() { return t('222', 'Start') },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true, // [TODO] Make a configuration.
                get 'requiredMessage'() { return t('223', START_SECONDS_REQUIRED_MESSAGE) },
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('224', 'Video ID will be resolved eventually...') },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'disabled': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('225', 'Platform') },
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
          get 'label'() { return t('226', 'Title') },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true, // [TODO] Make a configuration.
            get 'requiredMessage'() { return t('227', TITLE_REQUIRED_MESSAGE) },
            'maxLength': TITLE_MAX_LENGTH, // [TODO] Make a configuration.
            get 'maxLengthMessage'() { return t('228', TITLE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('229', 'Note') },
          'props': {
            'multiline': true, // [TODO] Make a configuration.
            'rows': NOTE_FIELD_ROWS, // [TODO] Make a configuration.
          },
          'has': {
            'maxLength': NOTE_MAX_LENGTH, // [TODO] Make a configuration.
            get 'maxLengthMessage'() { return t('230', NOTE_MAX_LENGTH_MESSAGE) }
          }
        }
      ]
    },
  ]
} as TStateForm

export default newRumbleBookmarkFormState

export const $9DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newRumbleBookmarkFormState)
  return base
})()
