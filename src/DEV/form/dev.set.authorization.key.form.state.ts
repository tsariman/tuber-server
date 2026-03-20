import {
  THEME_DARK_PAPER_COLOR,
  THEME_LIGHT_PAPER_COLOR,
  type TStateForm
} from '@tuber/shared'
import { register } from '../../business.logic/registry'
import STATE_KEY from '../../business.logic/state.key'
import { TBootstrapState } from '../../state/_state.common.types'
import { clone_or_default, clone_with_descriptors } from '../../business.logic'

const $49 = STATE_KEY['49']

register('state', '49', $49)
/** @id 49 */
const devSetAuthorizationKeyFormState: TStateForm = {
  '_id': '49',
  '_key': $49,
  '_type': 'stack',
  'props': {
    'sx': { 'p': 2, 'width': 476 },
    'spacing': 2,
  },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': { 'backgroundColor': THEME_LIGHT_PAPER_COLOR }
  },
  'items': [
    {
      'type': 'state_select',
      'name': 'platform',
      'label': 'Choose platform',
      'props': { 'variant': 'standard' },
      'has': {
        'formControlProps': { 'fullWidth': true },
        'items': [
          { 'label': 'Twitch', 'value': 'twitch' },
          { 'label': 'YouTube', 'value': 'youtube' },
          { 'label': 'Vimeo', 'value': 'vimeo' },
          { 'label': 'Dailymotion', 'value': 'dailymotion' },
          { 'label': 'Rumble', 'value': 'rumble' },
          { 'label': 'Odysee', 'value': 'odysee' },
          { 'label': 'Facebook', 'value': 'facebook' },
          { 'label': 'Bitchute', 'value': 'bitchute' }
        ]
      }
    },
    {
      'type': 'text',
      'name': 'name',
      'label': 'Name',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      }
    },
    {
      'type': 'text',
      'name': 'value',
      'label': 'Key',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      }
    },
    {
      'type': 'text',
      'name': 'expires_in',
      'label': 'Expires in',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      }
    },
    {
      'type': 'state_button',
      'props': {
        'sx': { 'width': '100%' }
      },
      'has': {
        'label': 'Set Authorization Key',
        'onclickHandler': 'tuberCallbacks.$49_C_1'
      }
    },
  ]
}

export default devSetAuthorizationKeyFormState

export const $49DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(devSetAuthorizationKeyFormState)
  const paperProps = clone_or_default(base.paperProps, {})
  paperProps.sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_PAPER_COLOR
  }
  base.paperProps = paperProps
  return base
})()

export const dev_set_authorization_key_form_state = {

  [$49]: devSetAuthorizationKeyFormState,

  // TODO - Insert more form states here.

} as TBootstrapState<TStateForm>

export const dev_set_authorization_key_form_state_dark = {

  [$49]: $49DarkThemeMode,

  // TODO - Insert more form states (dark themed) here.

} as TBootstrapState<TStateForm>