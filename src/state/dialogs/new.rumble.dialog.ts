import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { NEW_RUMBLE_ANNOTATION_UNSUFFIXED_NAME } from '../forms/new.rumble.annotation.form.state'

const _8 = '8'
const _8_KEY = 'newRumbleAnnotationDialog'
Config.register('state', _8, _8_KEY)
/** Dialog to create a new Rumble video annotation @id 8 */
export const newRumbleAnnotationDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _8,
  '_key': _8_KEY,
  'title': 'Insert new Rumble Annotation',
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
  'content': `$form : ${NEW_RUMBLE_ANNOTATION_UNSUFFIXED_NAME} : annotations`,
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
        'onclickHandle': 'tuberCallbacks._8_C_1'
      }
    }
  ],
  'open': true
}