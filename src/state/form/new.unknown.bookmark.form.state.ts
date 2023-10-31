import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { remove_form_suffix } from './_forms.business.logic'
import * as C from '../../constants'

const $28 = '28'
const $28_KEY = 'newUnknownBookmarkForm'
Config.register('state', $28, $28_KEY)
/** Form for creating a new unknown video bookmark @id 28 */
const newUnknownBookmarkFormState = {
  '_id': $28,
  '_key': $28_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textfield',
          'name': 'url',
          'label': 'Video URL',
          'props': {
            'fullWidth': true,
          },
          'inputProps': {
            'readOnly': true,
            'sx': { 'backgroundColor': 'grey.300' }
          },
          'has': {
            'required': true,
            'requiredMessage': 'Where did that URL go?',
          }
        },
        {
          'type': 'textfield',
          'name': 'embed_url',
          'label': 'Embed IFRAME URL',
          'props': {
            'fullWidth': true,
          },
          'has': {
            'required': true,
            'requiredMessage': C.EMBED_URL_MESSAGE,
          }
        },
        {
          'type': 'html',
          'has': {
            'content': `
              <span style="font-size:1.2rem;color:blue">
                Note:
              </span>
              Don't hesitate to paste-in the entire embed HTML code above. Bare in
              mind, some embed URLs need to be customized for them to work.
            `
          }
        },
        {
          'type': 'textfield',
          'name': 'title',
          'label': 'Title',
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': C.TITLE_REQUIRED_MESSAGE,
            'maxLength': C.TITLE_MAX_LENGTH,
            'maxLengthMessage': C.TITLE_MAX_LENGTH_MESSAGE,
          }
        },
        {
          'type': 'textarea',
          'name': 'note',
          'label': 'Note',
          'props': {
            'multiline': true,
            'rows': C.NOTE_FIELD_ROWS
          },
          'has': {
            'maxLength': C.NOTE_MAX_LENGTH,
            'maxLengthMessage': C.NOTE_MAX_LENGTH_MESSAGE
          }
        }
      ]
    },
  ]
} as IStateForm

export const NEW_UNKNOWN_BOOKMARK_UNSUFFIXED_NAME = remove_form_suffix(
  newUnknownBookmarkFormState._key
)

export default newUnknownBookmarkFormState