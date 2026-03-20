import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
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
import { TContextualUser } from '../../schema/user'
import AbstractState from '../AbstractState'
import Access from '../../business.logic/security/Access'
import {
  get_bookmark_switch_publish,
  get_bookmark_switch_publish_dummy
} from '../form.item.state'
import STATE_KEY from '../../business.logic/state.key'

const $13 = STATE_KEY['13']

register('state', '13', $13)
/** Form for editing an existing Vimeo bookmark. @id 13 */
export class EditVimeoBookmarkFormState extends AbstractState<TStateForm> {
  constructor(usr?: TContextualUser) { super(usr) }
  static withContext(usr?: TContextualUser) {
    const instance = new EditVimeoBookmarkFormState(usr)
    return instance
  }
  get light(): TStateForm {
    return {
      '_id': '13',
      '_key': $13,
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
                  get 'label'() { return t('158', 'Start') },
                  'props': {
                    'sx': { 'width': 240 },
                    'variant': 'filled'
                  },
                  'inputProps': { 'readOnly': true },
                  'has': {
                    'required': true,
                    get 'requiredMessage'() { return t('159', START_SECONDS_REQUIRED_MESSAGE) },
                  }
                },
                {
                  'type': 'textfield',
                  'name': 'videoid',
                  get 'label'() { return t('160', 'Video ID') },
                  'props': {
                    'fullWidth': true,
                    'variant': 'filled'
                  },
                  'inputProps': { 'readOnly': true }
                },
                {
                  'type': 'textfield',
                  'name': 'platform',
                  get 'label'() { return t('161', 'Platform') },
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
              get 'label'() { return t('162', 'Title') },
              'props': {
                'fullWidth': true
              },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('163', TITLE_REQUIRED_MESSAGE) },
                'maxLength': TITLE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('165', TITLE_MAX_LENGTH_MESSAGE) },
              }
            },
            {
              'type': 'textarea',
              'name': 'note',
              get 'label'() { return t('166', 'Note') },
              'props': {
                'multiline': true,
                'rows': NOTE_FIELD_ROWS
              },
              'has': {
                'maxLength': NOTE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('169', NOTE_MAX_LENGTH_MESSAGE) }
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

/** Form for editing an existing Vimeo bookmark. @id 13 @deprecated */
export const editVimeoBookmarkFormState = {
  '_id': '13',
  '_key': $13,
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
              get 'label'() { return t('158', 'Start') },
              'props': {
                'sx': { 'width': 240 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('159', START_SECONDS_REQUIRED_MESSAGE) },
              }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('160', 'Video ID') },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('161', 'Platform') },
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
          get 'label'() { return t('162', 'Title') },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('163', TITLE_REQUIRED_MESSAGE) },
            'maxLength': TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('165', TITLE_MAX_LENGTH_MESSAGE) },
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('166', 'Note') },
          'props': {
            'multiline': true,
            'rows': NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('169', NOTE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'switch_single',
          'name': 'is_published',
          get 'label'() { return t('170', 'Published') },
          'has': {
            get 'helperText'() { return t('171', PUBLISHED_HELPER_TEXT) }
          }
        }
      ]
    },
  ]
} as TStateForm

export default editVimeoBookmarkFormState

/** Dark theme variant of the form for editing an existing Vimeo bookmark. @id 13 @deprecated */
export const $13DarkThemeMode = (() => {
  const base = clone_with_descriptors(editVimeoBookmarkFormState)
  return base
})()
