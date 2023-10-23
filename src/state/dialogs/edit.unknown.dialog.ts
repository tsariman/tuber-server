import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { EDIT_UNKNOWN_ANNOTATION_UNSUFFIXED_NAME } from '../forms/edit.unknown.annotation.form.state'

const _31 = '31'
const _31_KEY = 'editUnknownAnnotationDialog'
Config.register('state', _31, _31_KEY)
/** Dialog to edit an unknown video platform annotation @id 31 */
const editUnknownAnnotationDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _31,
  '_key': _31_KEY,
  'title': 'Edit Unknown Annotation',
  'props': {
    'fullWidth': true,
    'maxWidth': 'md',
    'PaperProps': {
      'sx': { 'backgroundColor': backgroundState.color }
    }
  },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  'content': `$form : ${EDIT_UNKNOWN_ANNOTATION_UNSUFFIXED_NAME} : annotations`,
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': 'Cancel',
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'primary' },
      'has': {
        'disableOnError': true,
        'text': 'Save',
        'onclickHandle': 'tuberCallbacks._31_C_1'
      }
    }
  ],
  'open': true
}

export default editUnknownAnnotationDialogState