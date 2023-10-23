import Config from '../../config'
import IStateDialog from '../../../../tuber-client/src/controllers/interfaces/IStateDialog'
import { backgroundState } from '..'
import { NEW_DAILY_ANNNOTATION_UNSUFFIXED_NAME } from '../forms/new.daily.annotation.form.state'

const _21 = '21'
const _21_KEY = 'newDailyAnnotationDialog'
Config.register('state', _21, _21_KEY)
/** Dialog to create a new Dailymotion video annotation @id 21 */
const newDailyAnnotationDialogState: IStateDialog = {
  '_type': 'form',
  '_id': _21,
  '_key': _21_KEY,
  'title': 'Insert New Dailymotion Annotation',
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
  'content': `$form : ${NEW_DAILY_ANNNOTATION_UNSUFFIXED_NAME} : annotations`,
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
        'onclickHandle': 'tuberCallbacks._21_C_1'
      }
    }
  ],
  'open': true
}

export default newDailyAnnotationDialogState