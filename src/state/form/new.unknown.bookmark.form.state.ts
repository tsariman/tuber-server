import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import {
  EMBED_URL_MESSAGE,
  NOTE_FIELD_ROWS,
  NOTE_MAX_LENGTH,
  NOTE_MAX_LENGTH_MESSAGE,
  TITLE_MAX_LENGTH,
  TITLE_MAX_LENGTH_MESSAGE,
  TITLE_REQUIRED_MESSAGE,
  type TStateForm
} from '@tuber/shared'
import STATE_KEY from '../../business.logic/state.key'

const $28 = STATE_KEY['28']

register('state', '28', $28)
/** Form for creating a new unknown video bookmark @id 28 */
export const newUnknownBookmarkFormState = {
  '_id': '28',
  '_key': $28,
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
          'name': 'url',
          get 'label'() { return t('240', 'Video URL') },
          'props': {
            'fullWidth': true,
            'variant': 'filled'
          },
          'inputProps': { 'readOnly': true },
          'has': {
            'required': true, // [TODO] make a configuration.
            get 'requiredMessage'() { return t('241', 'Where did that URL go?') },
          }
        },
        {
          'type': 'textfield',
          'name': 'embed_url',
          get 'label'() { return t('242', 'Embed IFRAME URL') },
          'props': {
            'fullWidth': true,
          },
          'has': {
            // 'required': true,
            get 'requiredMessage'() { return t('243', EMBED_URL_MESSAGE) },
          }
        },
        {
          'type': 'html',
          'has': {
            'content': `
              <span style="font-size:1.2rem;color:blue">
                Note:
              </span>
              ${t('244', 'Don\'t hesitate to paste-in the entire embed HTML code above. Bare in\
              mind, some embed URLs need to be customized for them to work.')}
            `
          }
        },
        {
          'type': 'textfield',
          'name': 'thumbnail_url',
          get 'label'() { return t('245', 'Thumbnail URL') },
          'props': {
            'fullWidth': true,
            // 'variant': 'filled'
          },
          // 'inputProps': { 'readOnly': true },
        },
        {
          'type': 'textfield',
          'name': 'title',
          get 'label'() { return t('246', 'Title') },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('246', TITLE_REQUIRED_MESSAGE) },
            'maxLength': TITLE_MAX_LENGTH, // [TODO] make a configuration.
            get 'maxLengthMessage'() { return t('247', TITLE_MAX_LENGTH_MESSAGE) },
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('248', 'Note') },
          'props': {
            'multiline': true,
            'rows': NOTE_FIELD_ROWS // [TODO] Make a configuration.
          },
          'has': {
            'maxLength': NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('249', NOTE_MAX_LENGTH_MESSAGE) }
          }
        }
      ]
    },
  ]
} as TStateForm

export default newUnknownBookmarkFormState

export const $28DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(newUnknownBookmarkFormState)
  return base
})()
