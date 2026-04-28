import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import {
  NOTE_FIELD_ROWS,
  NOTE_MAX_LENGTH,
  NOTE_MAX_LENGTH_MESSAGE,
  TITLE_MAX_LENGTH,
  TITLE_MAX_LENGTH_MESSAGE,
  TITLE_REQUIRED_MESSAGE,
  TStateForm
} from '@tuber/shared'
import { TContextualUser } from '../../schema/user'
import AbstractState from '../AbstractState'
import STATE_KEY from '../../business.logic/state.key'
import Access from '../../business.logic/security/Access'

const $29 = STATE_KEY['29']

register('state', '29', $29)
/** Form for editing an existing unknown platform video bookmark @id 29 */
export class EditUnknownBookmarkFormState extends AbstractState<TStateForm> {
  constructor(usr?: TContextualUser) { super(usr) }
  static withContext(usr?: TContextualUser) {
    const instance = new EditUnknownBookmarkFormState(usr)
    return instance
  }
  get light(): TStateForm {
    const canEditEmbedUrl = Access.the(this.usr).can('publish.unknown.bookmark')

    return {
      '_id': '29',
      '_key': $29,
      'items': [
        {
          'type': 'stack',
          'props': { 'spacing': 2 },
          'items': [
            {
              'type': 'textfield',
              'name': 'url',
              get 'label'() { return t('146', 'Video URL') },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': true }
            },
            {
              'type': 'textfield',
              'name': 'embed_url',
              get 'label'() { return t('147', 'Embed IFRAME URL') },
              'props': {
                'fullWidth': true,
                'variant': 'filled'
              },
              'inputProps': { 'readOnly': !canEditEmbedUrl }
            },
            {
              'type': 'textfield',
              'name': 'thumbnail_url',
              get 'label'() { return t('148', 'Thumbnail URL') },
              'props': {
                'fullWidth': true,
                // 'variant': 'filled'
              },
              // 'inputProps': { 'readOnly': true },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('149', 'Where did that thumbnail URL go?') },
              }
            },
            {
              'type': 'textfield',
              'name': 'title',
              get 'label'() { return t('150', 'Title') },
              'props': {
                'fullWidth': true
              },
              'has': {
                'required': true,
                get 'requiredMessage'() { return t('151', TITLE_REQUIRED_MESSAGE) },
                'maxLength': TITLE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('153', TITLE_MAX_LENGTH_MESSAGE) }
              }
            },
            {
              'type': 'textarea',
              'name': 'note',
              get 'label'() { return t('154', 'Note') },
              'props': {
                'multiline': true,
                'rows': NOTE_FIELD_ROWS
              },
              'has': {
                'maxLength': NOTE_MAX_LENGTH,
                get 'maxLengthMessage'() { return t('157', NOTE_MAX_LENGTH_MESSAGE) }
              }
            }
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

/** Form for editing an existing unknown platform video bookmark @id 29 */
export const editUnknownBookmarkFormState: TStateForm = EditUnknownBookmarkFormState.withContext().light
export default editUnknownBookmarkFormState
/**
 * Dark theme variant of the form for editing an existing unknown platform
 * video bookmark
 * @id 29
 */
export const $29DarkThemeMode = EditUnknownBookmarkFormState.withContext().dark
