import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import * as C from '@tuber/shared'

register('state', '24', C.$24_STATE_KEY)
/** Form for creating a new facebook video bookmark @id 24 */
export const newFacebookBookmarkFormState = {
  '_id': '24',
  '_key': C.$24_STATE_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textfield',
          'name': 'url',
          get 'label'() { return t('200', 'Link') },
          'props': {
            'fullWidth': true,
            'variant': 'filled'
          },
          'inputProps': { 'readOnly': true },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('201', C.URL_REQUIRED_MESSAGE) },
          }
        },
        {
          'type': 'textfield',
          'name': 'embed_url',
          get 'label'() { return t('202', 'Embed HTML Code') },
          'props': {
            'fullWidth': true,
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('203', 'We need the embed HTML code') },
          }
        },
        {
          'type': 'textfield',
          'name': 'title',
          get 'label'() { return t('204', 'Title') },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('205', C.TITLE_REQUIRED_MESSAGE) },
            'maxLength': C.TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('207', C.TITLE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('208', 'Note') },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('211', C.NOTE_MAX_LENGTH_MESSAGE) }
          }
        }
      ]
    },
  ]
} as C.TStateForm

export default newFacebookBookmarkFormState

export const $24DarkThemeMode: C.TStateForm = (() => {
  const base = clone_with_descriptors(newFacebookBookmarkFormState)
  return base
})()