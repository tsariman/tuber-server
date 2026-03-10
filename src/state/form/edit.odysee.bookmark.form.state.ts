import { register } from '../../business.logic/registry'
import * as C from '@tuber/shared'
import { clone_with_descriptors, t } from '../../business.logic'
import AbstractState from '../AbstractState'
import { TContextualUser } from '../../schema/user'
import Access from '../../business.logic/security/Access'
import { get_bookmark_switch_publish, get_bookmark_switch_publish_dummy } from '../form.item.state'

register('state', '18', C.$18_STATE_KEY)
/** Form for editing an existing Odysee video bookmark @id 18 */
export class EditOdyseeBookmarkFormState extends AbstractState<C.TStateForm> {
  constructor(usr?: TContextualUser) { super(usr) }
  static withContext(usr?: TContextualUser) {
    const instance = new EditOdyseeBookmarkFormState(usr)
    return instance
  }
  get light(): C.TStateForm {
    return {
      '_id': '18',
      '_key': C.$18_STATE_KEY,
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
                  get 'label'() { return t('87', 'Start') },
                  'props': {
                    'sx': { 'width': 240 },
                    'variant': 'filled'
                  },
                  'inputProps': { 'readOnly': true },
                  'has': {
                    'required': true,
                    get 'requiredMessage'() { return t('109', C.START_SECONDS_REQUIRED_MESSAGE) },
                  }
                },
                {
                  'type': 'textfield',
                  'name': 'slug',
                  get 'label'() { return t('88', 'Video URL Slug') },
                  'props': {
                    'fullWidth': true,
                    'variant': 'filled'
                  },
                  'inputProps': { 'readOnly': true }
                },
                {
                  'type': 'textfield',
                  'name': 'platform',
                  get 'label'() { return t('89', 'Platform') },
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
              get 'label'() { return t('90', 'Title') },
              'props': {
                'fullWidth': true
              },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('110', C.TITLE_REQUIRED_MESSAGE) },
                'maxLength': C.TITLE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('112', C.TITLE_MAX_LENGTH_MESSAGE) }
              }
            },
            {
              'type': 'textarea',
              'name': 'note',
              get 'label'() { return t('91', 'Note') },
              'props': {
                'multiline': true,
                'rows': C.NOTE_FIELD_ROWS
              },
              'has': {
                'maxLength': C.NOTE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('115', C.NOTE_MAX_LENGTH_MESSAGE) }
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

/** Form for editing an existing Odysee video bookmark @id 18 @deprecated */
export const editOdyseeBookmarkFormState = {
  '_id': '18',
  '_key': C.$18_STATE_KEY,
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
              'label'() { return t('87', 'Start') },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('109', C.START_SECONDS_REQUIRED_MESSAGE) },
              }
            },
            {
              'type': 'textfield',
              'name': 'slug',
              get 'label'() { return t('88', 'Video URL Slug') },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('89', 'Platform') },
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
          get 'label'() { return t('90', 'Title') },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('110', C.TITLE_REQUIRED_MESSAGE) },
            'maxLength': C.TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('112', C.TITLE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('91', 'Note') },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('115', C.NOTE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'switch_single',
          'name': 'is_published',
          get 'label'() { return t('92', 'Published') },
          'has': {
            get 'helperText'() { return t('116', C.PUBLISHED_HELPER_TEXT) }
          }
        }
      ]
    },
  ]
} as C.TStateForm

export default editOdyseeBookmarkFormState

/** Dark theme variant of the form for editing an existing Odysee bookmark. @id 18 @deprecated */
export const $18DarkThemeMode = (() => {
  const base = clone_with_descriptors(editOdyseeBookmarkFormState)
  return base
})()
