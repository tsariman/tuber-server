import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import {
  TStateForm,
  NOTE_FIELD_ROWS,
  NOTE_MAX_LENGTH,
  URL_REQUIRED_MESSAGE,
  TITLE_REQUIRED_MESSAGE,
  TITLE_MAX_LENGTH,
  TITLE_MAX_LENGTH_MESSAGE,
  NOTE_MAX_LENGTH_MESSAGE,
} from '@tuber/shared'
import STATE_KEY from '../../business.logic/state.key'

const $24 = STATE_KEY['24']

register('state', '24', $24)
/** Form for creating a new facebook video bookmark @id 24 */
export const newFacebookBookmarkFormState = {
  '_id': '24',
  '_key': $24,
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
            get 'requiredMessage'() { return t('201', URL_REQUIRED_MESSAGE) },
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
            get 'requiredMessage'() { return t('205', TITLE_REQUIRED_MESSAGE) },
            'maxLength': TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('207', TITLE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('208', 'Note') },
          'props': {
            'multiline': true,
            'rows': NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('211', NOTE_MAX_LENGTH_MESSAGE) }
          }
        }
      ]
    },
  ]
} as TStateForm

export default newFacebookBookmarkFormState

export const $24DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newFacebookBookmarkFormState)
  return base
})()