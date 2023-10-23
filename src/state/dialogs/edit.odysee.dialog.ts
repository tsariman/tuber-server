import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { EDIT_ODYSEE_ANNOTATION_UNSUFFIXED_NAME } from '../forms/edit.odysee.annotation.form.state'

const _23 = '23'
const _23_KEY = 'editOdyseeAnnotationDialog'
Config.register('state', _23, _23_KEY)
/** Dialog to create a edit Odysee video annotation @id 23 */
const editOdyseeAnnotationDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _23,
  '_key': _23_KEY,
  'title': 'Edit Odysee Annotation',
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
  'content': `$form : ${EDIT_ODYSEE_ANNOTATION_UNSUFFIXED_NAME} : annotations`,
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
        'onclickHandle': 'tuberCallbacks._23_C_1'
      }
    }
  ],
  'open': true
}

export default editOdyseeAnnotationDialogState