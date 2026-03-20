import {
  NOTE_FIELD_ROWS,
  NOTE_MAX_LENGTH,
  NOTE_MAX_LENGTH_MESSAGE,
  PUBLISHED_HELPER_TEXT,
  START_SECONDS_REQUIRED_MESSAGE,
  TITLE_MAX_LENGTH,
  TITLE_MAX_LENGTH_MESSAGE,
  TITLE_REQUIRED_MESSAGE,
  TStateForm,
  TStateFormItem
} from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { clone_with_descriptors, t } from '../../business.logic'
import AbstractState from '../AbstractState'
import { TContextualUser } from '../../schema/user'
import Access from '../../business.logic/security/Access'
import {
  get_bookmark_switch_publish,
  get_bookmark_switch_publish_dummy
} from '../form.item.state'
import STATE_KEY from '../../business.logic/state.key'

const $18 = STATE_KEY['18']

register('state', '18', $18)
/** Form for editing an existing Odysee video bookmark @id 18 */
export class EditOdyseeBookmarkFormState extends AbstractState<TStateForm> {
  constructor(usr?: TContextualUser) { super(usr) }
  static withContext(usr?: TContextualUser) {
    const instance = new EditOdyseeBookmarkFormState(usr)
    return instance
  }
  get light(): TStateForm {
    return {
      '_id': '18',
      '_key': $18,
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
                    get 'requiredMessage'() { return t('109', START_SECONDS_REQUIRED_MESSAGE) },
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
                get 'requiredMessage'() { return t('110', TITLE_REQUIRED_MESSAGE) },
                'maxLength': TITLE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('112', TITLE_MAX_LENGTH_MESSAGE) }
              }
            },
            {
              'type': 'textarea',
              'name': 'note',
              get 'label'() { return t('91', 'Note') },
              'props': {
                'multiline': true,
                'rows': NOTE_FIELD_ROWS
              },
              'has': {
                'maxLength': NOTE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('115', NOTE_MAX_LENGTH_MESSAGE) }
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

/** Form for editing an existing Odysee video bookmark @id 18 @deprecated */
export const editOdyseeBookmarkFormState = {
  '_id': '18',
  '_key': $18,
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
                get 'requiredMessage'() { return t('109', START_SECONDS_REQUIRED_MESSAGE) },
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
            get 'requiredMessage'() { return t('110', TITLE_REQUIRED_MESSAGE) },
            'maxLength': TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('112', TITLE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('91', 'Note') },
          'props': {
            'multiline': true,
            'rows': NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('115', NOTE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'switch_single',
          'name': 'is_published',
          get 'label'() { return t('92', 'Published') },
          'has': {
            get 'helperText'() { return t('116', PUBLISHED_HELPER_TEXT) }
          }
        }
      ]
    },
  ]
} as TStateForm

export default editOdyseeBookmarkFormState

/** Dark theme variant of the form for editing an existing Odysee bookmark. @id 18 @deprecated */
export const $18DarkThemeMode = (() => {
  const base = clone_with_descriptors(editOdyseeBookmarkFormState)
  return base
})()
