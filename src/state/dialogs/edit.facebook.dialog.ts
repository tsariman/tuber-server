import Config from '../../config'
import { backgroundState } from '..'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { EDIT_FACEBOOK_ANNOTATION_UNSUFFIXED_NAME } from '../forms/edit.facebook.annotation.form.state'

const _27 = '27'
const _27_KEY = 'editFacebookAnnotationDialog'
Config.register('state', _27, _27_KEY)
/** Dialog to edit a Facebook video annotation @id 27 */
const editFacebookAnnotationDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _27,
  '_key': _27_KEY,
  'title': 'Edit Facebook Annotation',
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
  'content': `$form : ${EDIT_FACEBOOK_ANNOTATION_UNSUFFIXED_NAME} : annotations`,
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
        'onclickHandle': 'tuberCallbacks._27_C_1'
      }
    }
  ],
  'open': true
}

export default editFacebookAnnotationDialogState