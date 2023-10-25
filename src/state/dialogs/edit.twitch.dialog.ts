import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import Config from '../../config'
import { EDIT_TWITCH_ANNOTATION_UNSUFFIXED_NAME } from '../forms/edit.twitch.annotation.form.state'

const _37 = '37'
const _37_KEY = 'editTwitchAnnotationDialog'
Config.register('state', _37, _37_KEY)
/** Dialog to edit an existing Twitch video annotation @id 37 */
const editTwitchAnnotationDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _37,
  '_key': _37_KEY,
  'title': 'Edit Twitch Annotation',
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
  'content': `'$form : ${EDIT_TWITCH_ANNOTATION_UNSUFFIXED_NAME} : annotations'`,
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
        'onclickHandle': 'tuberCallbacks._37_C_1'
      }
    }
  ],
  'open': true
}

export default editTwitchAnnotationDialogState