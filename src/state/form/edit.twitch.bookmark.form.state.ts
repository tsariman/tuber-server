import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import { NOTE_FIELD_ROWS, NOTE_MAX_LENGTH, NOTE_MAX_LENGTH_MESSAGE, PUBLISHED_HELPER_TEXT, START_SECONDS_REQUIRED_MESSAGE, TITLE_MAX_LENGTH, TITLE_MAX_LENGTH_MESSAGE, TITLE_REQUIRED_MESSAGE, TStateForm, TStateFormItem } from '@tuber/shared'
import { TContextualUser } from '../../schema/user'
import AbstractState from '../AbstractState'
import Access from '../../business.logic/security/Access'
import {
  get_bookmark_switch_publish,
  get_bookmark_switch_publish_dummy
} from '../form.item.state'
import STATE_KEY from '../../business.logic/state.key'

const $39 = STATE_KEY['39']

register('state', '39', $39)
/** Form for editing an existing Twitch bookmark. @id 39 */
export class EditTwitchBookmarkFormState extends AbstractState<TStateForm> {
  constructor(usr?: TContextualUser) { super(usr) }
  static withContext(usr?: TContextualUser) {
    const instance = new EditTwitchBookmarkFormState(usr)
    return instance
  }
  get light(): TStateForm {
    return {
      '_id': '39',
      '_key': $39,
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
                  get 'label'() { return t('132', 'Start') },
                  'props': {
                    'sx': { 'width': 240 },
                    'variant': 'filled'
                  },
                  'inputProps': { 'readOnly': true },
                  'has': {
                    'required': true,
                    get 'requiredMessage'() { return t('133', START_SECONDS_REQUIRED_MESSAGE) },
                  }
                },
                {
                  'type': 'textfield',
                  'name': 'videoid',
                  get 'label'() { return t('134', 'Video ID') },
                  'props': {
                    'fullWidth': true,
                    'variant': 'filled'
                  },
                  'inputProps': { 'readOnly': true }
                },
                {
                  'type': 'textfield',
                  'name': 'platform',
                  get 'label'() { return t('135', 'Platform') },
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
              get 'label'() { return t('136', 'Title') },
              'props': {
                'fullWidth': true
              },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('137', TITLE_REQUIRED_MESSAGE) },
                'maxLength': TITLE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('139', TITLE_MAX_LENGTH_MESSAGE) },
              }
            },
            {
              'type': 'textarea',
              'name': 'note',
              get 'label'() { return t('140', 'Note') },
              'props': {
                'multiline': true,
                'rows': NOTE_FIELD_ROWS
              },
              'has': {
                'maxLength': NOTE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('143', NOTE_MAX_LENGTH_MESSAGE) }
              }
            },
            Access.the(this.usr).hasClearance('supporter').decide<TStateFormItem>(
              get_bookmark_switch_publish(),
              get_bookmark_switch_publish_dummy()
            )
          ]
        },
      ]
    }
  }
  get dark(): TStateForm {
    const base = clone_with_descriptors(this.light)
    return base
  }
}

/** Form for editing an existing Twitch bookmark. @id 39 @deprecated */
export const editTwitchBookmarkFormState = {
  '_id': '39',
  '_key': $39,
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
              get 'label'() { return t('132', 'Start') },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('133', START_SECONDS_REQUIRED_MESSAGE) },
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('134', 'Video ID') },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('135', 'Platform') },
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
          get 'label'() { return t('136', 'Title') },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('137', TITLE_REQUIRED_MESSAGE) },
            'maxLength': TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('139', TITLE_MAX_LENGTH_MESSAGE) },
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('140', 'Note') },
          'props': {
            'multiline': true,
            'rows': NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('143', NOTE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'switch_single',
          'name': 'is_published',
          get 'label'() { return t('144', 'Published') },
          'has': {
            get 'helperText'() { return t('145', PUBLISHED_HELPER_TEXT) }
          }
        }
      ]
    },
  ]
} as TStateForm

export default editTwitchBookmarkFormState

/** Dark theme variant of the form for editing an existing Twitch bookmark. @id 39 @deprecated */
export const $39DarkThemeMode = (() => {
  const base = clone_with_descriptors(editTwitchBookmarkFormState)
  return base
})()
