import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import * as C from '@tuber/shared'
import { TContextualUser } from '../../schema/user'
import AbstractState from '../AbstractState'
import Access from '../../business.logic/security/Access'
import { get_bookmark_switch_publish, get_bookmark_switch_publish_dummy } from '../form.item.state'

register('state', '39', C.$39_STATE_KEY)
/** Form for editing an existing Twitch bookmark. @id 39 */
export class EditTwitchBookmarkFormState extends AbstractState<C.TStateForm> {
  constructor(usr?: TContextualUser) { super(usr) }
  static withContext(usr?: TContextualUser) {
    const instance = new EditTwitchBookmarkFormState(usr)
    return instance
  }
  get light(): C.TStateForm {
    return {
      '_id': '39',
      '_key': C.$39_STATE_KEY,
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
                    get 'requiredMessage'() { return t('133', C.START_SECONDS_REQUIRED_MESSAGE) },
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
                get 'requiredMessage'() { return t('137', C.TITLE_REQUIRED_MESSAGE) },
                'maxLength': C.TITLE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('139', C.TITLE_MAX_LENGTH_MESSAGE) },
              }
            },
            {
              'type': 'textarea',
              'name': 'note',
              get 'label'() { return t('140', 'Note') },
              'props': {
                'multiline': true,
                'rows': C.NOTE_FIELD_ROWS
              },
              'has': {
                'maxLength': C.NOTE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('143', C.NOTE_MAX_LENGTH_MESSAGE) }
              }
            },
            Access.the(this.usr).hasClearance('supporter').decide<C.TStateFormItem>(
              get_bookmark_switch_publish(),
              get_bookmark_switch_publish_dummy()
            )
          ]
        },
      ]
    }
  }
  get dark(): C.TStateForm {
    const base = clone_with_descriptors(this.light)
    return base
  }
}

/** Form for editing an existing Twitch bookmark. @id 39 @deprecated */
export const editTwitchBookmarkFormState = {
  '_id': '39',
  '_key': C.$39_STATE_KEY,
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
                get 'requiredMessage'() { return t('133', C.START_SECONDS_REQUIRED_MESSAGE) },
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
            get 'requiredMessage'() { return t('137', C.TITLE_REQUIRED_MESSAGE) },
            'maxLength': C.TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('139', C.TITLE_MAX_LENGTH_MESSAGE) },
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('140', 'Note') },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('143', C.NOTE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'switch_single',
          'name': 'is_published',
          get 'label'() { return t('144', 'Published') },
          'has': {
            get 'helperText'() { return t('145', C.PUBLISHED_HELPER_TEXT) }
          }
        }
      ]
    },
  ]
} as C.TStateForm

export default editTwitchBookmarkFormState

/** Dark theme variant of the form for editing an existing Twitch bookmark. @id 39 @deprecated */
export const $39DarkThemeMode = (() => {
  const base = clone_with_descriptors(editTwitchBookmarkFormState)
  return base
})()
