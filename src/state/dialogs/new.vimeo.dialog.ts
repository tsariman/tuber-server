import Config from '../../config'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { backgroundState } from '..'
import { NEW_VIMEO_ANNNOTATION_UNSUFFIXED_NAME } from '../forms/new.vimeo.annotation.form.state'

const _14 = '14'
const _14_KEY = 'newVimeoAnnotationDialog'
Config.register('state', _14, _14_KEY)
/** Dialog to create a new Vimeo video annotation @id 14 */
const newVimeoAnnotationDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _14,
  '_key': _14_KEY,
  'title': 'Insert New Vimeo Annotation',
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
  'content': `$form : ${NEW_VIMEO_ANNNOTATION_UNSUFFIXED_NAME} : annotations`,
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
        'text': 'Save',
        'onclickHandle': 'tuberCallbacks._14_C_1'
      }
    }
  ],
  'open': true // Careful! Must be set to true
}

export default newVimeoAnnotationDialogState