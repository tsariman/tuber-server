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
import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import AbstractState from '../AbstractState'
import { TContextualUser } from '../../schema/user'
import Access from '../../business.logic/security/Access'
import {
  get_bookmark_switch_publish,
  get_bookmark_switch_publish_dummy
} from '../form.item.state'
import STATE_KEY from '../../business.logic/state.key'

const $25 = STATE_KEY['25']

register('state', '25', $25)
/** Form for editing an existing Facebook video bookmark @id 25 */
export class EditFacebookBookmarkFormState extends AbstractState<TStateForm> {
  constructor(usr?: TContextualUser) { super(usr) }
  static withContext(usr?: TContextualUser) {
    const instance = new EditFacebookBookmarkFormState(usr)
    return instance
  }
  get light(): TStateForm {
    return {
      '_id': '25',
      '_key': $25,
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
                    get 'requiredMessage'() { return t('101', START_SECONDS_REQUIRED_MESSAGE) },
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
                get 'requiredMessage'() { return t('102', TITLE_REQUIRED_MESSAGE) },
                'maxLength': TITLE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('104', TITLE_MAX_LENGTH_MESSAGE) },
              }
            },
            {
              'type': 'textarea',
              'name': 'note',
              get 'label'() { return t('85', 'Note') },
              'props': {
                'multiline': true,
                'rows': NOTE_FIELD_ROWS
              },
              'has': {
                'maxLength': NOTE_MAX_LENGTH,
                get 'maxLengthMessage'() {return t('107', NOTE_MAX_LENGTH_MESSAGE) }
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

/** Form for editing an existing Facebook bookmark. @id 25 @deprecated */
export const editFacebookBookmarkFormState = {
  '_id': '25',
  '_key': $25,
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
                get 'requiredMessage'() { return t('101', START_SECONDS_REQUIRED_MESSAGE) },
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
            get 'requiredMessage'() { return t('102', TITLE_REQUIRED_MESSAGE) },
            'maxLength': TITLE_MAX_LENGTH,
            get 'maxLengthMessage'() { return t('104', TITLE_MAX_LENGTH_MESSAGE) },
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          get 'label'() { return t('85', 'Note') },
          'props': {
            'multiline': true,
            'rows': NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': NOTE_MAX_LENGTH,
            get 'maxLengthMessage'() {return t('107', NOTE_MAX_LENGTH_MESSAGE) }
          }
        },
        {
          'type': 'switch_single',
          'name': 'is_published',
          get 'label'() { return t('86', 'Published') },
          'has': {
            get 'helperText'() { return t('108', PUBLISHED_HELPER_TEXT) }
          }
        }
      ]
    },
  ]
} as TStateForm

export default editFacebookBookmarkFormState

/** Dark theme variant of the form for editing an existing Facebook bookmark. @id 25 @deprecated */
export const $25DarkThemeMode = (() => {
  const base = clone_with_descriptors(editFacebookBookmarkFormState)
  return base
})()
