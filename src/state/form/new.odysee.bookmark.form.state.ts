import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import * as C from '@tuber/shared'

register('state', '17', C.$17_STATE_KEY)
/** Form for creating a new odysee video bookmark @id 17 */
export const newOdyseeBookmarkFormState = {
  '_id': '17',
  '_key': C.$17_STATE_KEY,
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
                get 'requiredMessage'() { return t('213', C.START_SECONDS_REQUIRED_MESSAGE) },
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
            get 'requiredMessage'() { return t('217', C.TITLE_REQUIRED_MESSAGE) },
            'maxLength': C.TITLE_MAX_LENGTH, // [TODO] Make a configuration.
            get 'maxLengthMessage'() { return t('218', C.TITLE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('219', 'Note') },
          'props': {
            'multiline': true,  // [TODO] Make a configuration.
            'rows': C.NOTE_FIELD_ROWS  // [TODO] Make a configuration.
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,  // [TODO] Make a configuration.
            get 'maxLengthMessage'() { return t('220', C.NOTE_MAX_LENGTH_MESSAGE) }
          }
        }
      ]
    },
  ]
} as C.TStateForm

export default newOdyseeBookmarkFormState

export const $17DarkThemeMode: C.TStateForm = (() => {
  const base = clone_with_descriptors(newOdyseeBookmarkFormState)
  return base
})()
