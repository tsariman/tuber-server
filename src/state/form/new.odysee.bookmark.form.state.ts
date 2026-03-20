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
  TStateForm,
} from '@tuber/shared'
import STATE_KEY from '../../business.logic/state.key'

const $17 = STATE_KEY['17']

register('state', '17', $17)
/** Form for creating a new odysee video bookmark @id 17 */
export const newOdyseeBookmarkFormState = {
  '_id': '17',
  '_key': $17,
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
              get 'label'() { return t('212', 'Start') },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true, // [TODO] Make a configuration.
                get 'requiredMessage'() { return t('213', START_SECONDS_REQUIRED_MESSAGE) },
              }
            },
            {
              'type': 'textfield',
              'name': 'slug',
              get 'label'() { return t('214', 'Video URL Slug') },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('215', 'Platform') },
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
          get 'label'() { return t('216', 'Title') },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true, // [TODO] Make a configuration.
            get 'requiredMessage'() { return t('217', TITLE_REQUIRED_MESSAGE) },
            'maxLength': TITLE_MAX_LENGTH, // [TODO] Make a configuration.
            get 'maxLengthMessage'() { return t('218', TITLE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('219', 'Note') },
          'props': {
            'multiline': true,  // [TODO] Make a configuration.
            'rows': NOTE_FIELD_ROWS  // [TODO] Make a configuration.
          },
          'has': {
            'maxLength': NOTE_MAX_LENGTH,  // [TODO] Make a configuration.
            get 'maxLengthMessage'() { return t('220', NOTE_MAX_LENGTH_MESSAGE) }
          }
        }
      ]
    },
  ]
} as TStateForm

export default newOdyseeBookmarkFormState

export const $17DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newOdyseeBookmarkFormState)
  return base
})()
