import {
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  EP_ACCOUNT,
  TStateDialog
} from '@tuber/shared'
import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'
import STATE_KEY from '../../business.logic/state.key'

const $84 = STATE_KEY['84']

register('state', '84', $84)
/** Dialog state to confirm account deletion. @id 84 */
const confirmDeleteAccountDialogState: TStateDialog = {
  '_type': 'alert',
  '_id': '84',
  '_key': $84,
  get 'title'() { return t('delete_account', 'Delete Account') },
  'props': { 'fullWidth': true },
  'titleProps': {
    'sx': { 'textAlign': 'center' }
  },
  get 'content'() {
    return t(
      'delete_account_confirm_message',
      'Are you sure you want to delete your account? This action cannot be undone.'
    )
  },
  'actions': [
    {
      'type': 'state_button',
      'props': { 'color': 'secondary' },
      'has': {
        get 'text'() { return t('cancel', 'Cancel') },
        'onclickHandlerDirective': {
          'type': '$redux_actions',
          'actions': [
            { 'type': 'dialog/dialogClose' }
          ]
        }
      }
    },
    {
      'type': 'state_button',
      'props': { 'color': 'error', 'variant': 'contained' },
      'has': {
        get 'text'() { return t('delete_account', 'Delete Account') },
        'onclickHandlerDirective': {
          'type': '$deletes',
          'endpoint': EP_ACCOUNT,
          'rules': [ 'disable_on_submit', 'bootstrap' ],
          'actions': [
            { 'type': 'dialog/dialogClose' },
            { 'type': 'app/appSwitchPage', 'payload': '/' },
            { 'type': 'STATE_RESET' },
          ]
        }
      }
    }
  ],
  'open': true
}

/** Dark theme mode for confirm account deletion dialog. @id 84 */
export const $84DarkThemeMode: TStateDialog = (() => {
  const base = clone_with_descriptors(confirmDeleteAccountDialogState)
  const props = clone_with_descriptors(base.props ?? {})
  const paperProps = clone_with_descriptors(props.PaperProps ?? {})
  const sx: typeof paperProps['sx'] = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
  }
  paperProps.sx = sx
  props.PaperProps = paperProps
  base.props = props
  return base
})()

export default confirmDeleteAccountDialogState
