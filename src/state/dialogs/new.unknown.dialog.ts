import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { NEW_UNKNOWN_ANNOTATION_UNSUFFIXED_NAME } from '../forms/new.unknown.annotation.form.state'

const _30 = '30'
const _30_KEY = 'newUnknownAnnotationDialog'
Config.register('state', _30, _30_KEY)
/** Dialog to create a new Unknown video annotation @id 30 */
const newUnknownAnnotationDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _30,
  '_key': _30_KEY,
  'title': 'Insert new Unknown Annotation',
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
  'content': `$form : ${NEW_UNKNOWN_ANNOTATION_UNSUFFIXED_NAME} : annotations`,
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
        'onclickHandle': 'tuberCallbacks._30_C_1'
      }
    }
  ],
  'open': true
}

export default newUnknownAnnotationDialogState