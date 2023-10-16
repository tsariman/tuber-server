import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { EDIT_RUMBLE_ANNOTATION_UNSUFFIXED_NAME } from '../forms/edit.rumble.annotation.form.state'

const _11 = '11'
const _11_KEY = 'editRumbleAnnotationDialog'
Config.register('state', _11, _11_KEY)
/** Dialog to create a edit Rumble video annotation @id 11 */
export const editRumbleAnnotationDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _11,
  '_key': _11_KEY,
  'title': 'Edit Rumble Annotation',
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
  'content': `$form : ${EDIT_RUMBLE_ANNOTATION_UNSUFFIXED_NAME} : annotations`,
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
        'disableOnError': true,
        'text': 'Save',
        'onclickHandle': 'tuberCallbacks._11_C_1'
      }
    }
  ],
  'open': true
}