import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { remove_form_suffix } from './_forms.business.logic'
import * as C from '../../constants'

const _29 = '29'
const _29_KEY = 'editUnknownBookmarkForm'
Config.register('state', _29, _29_KEY)
/** Form for editing an existing unknown platform video bookmark @id 29 */
const editUnknownBookmarkFormState = {
  '_id': _29,
  '_key': _29_KEY,
  'items': [
    {
      'type': 'stack',
      'props': { 'spacing': 2 },
      'items': [
        {
          'type': 'textfield',
          'name': 'url',
          'label': 'Video URL',
          'props': { 'fullWidth': true },
          'inputProps': {
            'readOnly': true,
            'sx': { 'backgroundColor': 'grey.300' }
          }
        },
        {
          'type': 'textfield',
          'name': 'embed_url',
          'label': 'Embed IFRAME URL',
          'props': { 'fullWidth': true },
          'inputProps': {
            'readOnly': true,
            'sx': { 'backgroundColor': 'grey.300' }
          }
        },
        {
          'type': 'textfield',
          'name': 'title',
          'label': 'TItle',
          'props': {
            'fullWidth': true
          },
          'has': {
            'required': true,
            'requiredMessage': C.TITLE_REQUIRED_MESSAGE,
            'maxLength': C.TITLE_MAX_LENGTH,
            'maxLengthMessage': C.TITLE_MAX_LENGTH_MESSAGE
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

export const EDIT_UNKNOWN_BOOKMARK_UNSUFFIXED_NAME = remove_form_suffix(
  editUnknownBookmarkFormState._key
)

export default editUnknownBookmarkFormState