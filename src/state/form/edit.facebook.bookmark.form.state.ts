import { clone_with_descriptors, t } from '../../business.logic'
import * as C from '@tuber/shared'
import { register } from '../../business.logic/registry'
import AbstractState from '../AbstractState'
import { TContextualUser } from '../../schema/user'
import Access from '../../business.logic/security/Access'
import { get_bookmark_switch_publish, get_bookmark_switch_publish_dummy } from '../form.item.state'

register('state', '25', C.$25_STATE_KEY)
/** Form for editing an existing Facebook video bookmark @id 25 */
export class EditFacebookBookmarkFormState extends AbstractState<C.TStateForm> {
  constructor(usr?: TContextualUser) { super(usr) }
  static withContext(usr?: TContextualUser) {
    const instance = new EditFacebookBookmarkFormState(usr)
    return instance
  }
  get light(): C.TStateForm {
    return {
      '_id': '25',
      '_key': C.$25_STATE_KEY,
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
                  get 'label'() { return t('80', 'Start') },
                  'props': {
                    'sx': { 'width': 160 },
                    'variant': 'filled'
                  },
                  'inputProps': { 'readOnly': true },
                  'has': {
                    'required': true,
                    get 'requiredMessage'() { return t('101', C.START_SECONDS_REQUIRED_MESSAGE) },
                  }
                },
                {
                  'type': 'textfield',
                  'name': 'author',
                  get 'label'() { return t('81', 'Author') },
                  'props': {
                    'fullWidth': true,
                    'variant': 'filled',
                  },
                  'inputProps': { 'readOnly': true }
                },
                {
                  'type': 'textfield',
                  'name': 'videoid',
                  get 'label'() { return t('82', 'Video ID') },
                  'props': {
                    'sx': { 'width': 320 },
                    'variant': 'filled'
                  },
                  'inputProps': { 'readOnly': true }
                },
                {
                  'type': 'textfield',
                  'name': 'platform',
                  get 'label'() { return t('83', 'Platform') },
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
              get 'label'() { return t('84', 'Title') },
              'props': {
                'fullWidth': true
              },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('102', C.TITLE_REQUIRED_MESSAGE) },
                'maxLength': C.TITLE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('104', C.TITLE_MAX_LENGTH_MESSAGE) },
              }
            },
            {
              'type': 'textarea',
              'name': 'note',
              get 'label'() { return t('85', 'Note') },
              'props': {
                'multiline': true,
                'rows': C.NOTE_FIELD_ROWS
              },
              'has': {
                'maxLength': C.NOTE_MAX_LENGTH,
                get 'maxLengthMessage'() {return t('107', C.NOTE_MAX_LENGTH_MESSAGE) }
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

/** Form for editing an existing Facebook bookmark. @id 25 @deprecated */
export const editFacebookBookmarkFormState = {
  '_id': '25',
  '_key': C.$25_STATE_KEY,
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
              get 'label'() { return t('80', 'Start') },
              'props': {
                'sx': { 'width': 160 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('101', C.START_SECONDS_REQUIRED_MESSAGE) },
              }
            },
            {
              'type': 'textfield',
              'name': 'author',
              get 'label'() { return t('81', 'Author') },
              'props': {
                'fullWidth': true,
                'variant': 'filled',
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'videoid',
              get 'label'() { return t('82', 'Video ID') },
              'props': {
                'sx': { 'width': 320 },
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'platform',
              get 'label'() { return t('83', 'Platform') },
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
          get 'label'() { return t('84', 'Title') },
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            get 'requiredMessage'() { return t('102', C.TITLE_REQUIRED_MESSAGE) },
            'maxLength': C.TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('104', C.TITLE_MAX_LENGTH_MESSAGE) },
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('85', 'Note') },
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() {return t('107', C.NOTE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'switch_single',
          'name': 'is_published',
          get 'label'() { return t('86', 'Published') },
          'has': {
            get 'helperText'() { return t('108', C.PUBLISHED_HELPER_TEXT) }
          }
        }
      ]
    },
  ]
} as C.TStateForm

export default editFacebookBookmarkFormState

/** Dark theme variant of the form for editing an existing Facebook bookmark. @id 25 @deprecated */
export const $25DarkThemeMode = (() => {
  const base = clone_with_descriptors(editFacebookBookmarkFormState)
  return base
})()
