import { $49_KEY } from '../../constants'
import Config from '../../config'
import { TStateForm } from '../../common.types'

Config.register('state', '49', $49_KEY)
/** @id 49 */
const devSetAuthorizationKeyFormState: TStateForm = {
  '_id': '49',
  '_key': $49_KEY,
  '_type': 'stack',
  'props': {
    'sx': { 'p': 2, 'width': 476 },
    'spacing': 2,
  },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': { 'backgroundColor': '#dddddd' }
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
        'onclickHandle': 'tuberCallbacks.$49_C_1'
      }
    },
  ]
}

export default devSetAuthorizationKeyFormState