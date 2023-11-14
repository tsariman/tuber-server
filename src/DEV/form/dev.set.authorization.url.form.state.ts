import Config from 'src/config'
import { $50_KEY } from '../../constants'
import { TStateForm } from '../../common.types'

Config.register('state', '50', $50_KEY)
/** Form to set the authorization URL for a platform. @id 50 */
const devSetAuthorizationUrlFormState: TStateForm = {
  '_id': '50',
  '_key': $50_KEY,
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
      'name': 'purpose',
      'label': 'Purpose',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      }
    },
    {
      'type': 'text',
      'name': 'url',
      'label': 'URL',
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
        'label': 'Set Authorization URL',
        'onclickHandle': 'tuberCallbacks.$50_C_1'
      }
    },
  ]
}

export default devSetAuthorizationUrlFormState