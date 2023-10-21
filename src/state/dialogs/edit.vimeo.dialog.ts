import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import Config from '../../config'
import { EDIT_VIMEO_ANNOTATION_UNSUFFIXED_NAME } from '../forms/edit.vimeo.annotation.form.state'

const _15 = '15'
const _15_KEY = 'editVimeoAnnotationDialog'
Config.register('state', _15, _15_KEY)
/** Dialog to edit an existing Vimeo video annotation @id 15 */
const editVimeoAnnotationDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _15,
  '_key': _15_KEY,
  'title': 'Edit Vimeo Annotation',
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
  'content': `'$form : ${EDIT_VIMEO_ANNOTATION_UNSUFFIXED_NAME} : annotations'`,
  'actions': [
    {
      'type': 'json_button',
      'props': { 'color': 'secondary' },
      'has': {
        'text': 'Cancel',
        'onclickHandle': 'tuberCallbacks.defaultClose'
      }
    },
    {
      'type': 'json_button',
      'props': { 'color': 'primary' },
      'has': {
        'text': 'Save',
        'onclickHandle': 'tuberCallbacks._15_C_1'
      }
    }
  ],
  'open': true
}

export default editVimeoAnnotationDialogState