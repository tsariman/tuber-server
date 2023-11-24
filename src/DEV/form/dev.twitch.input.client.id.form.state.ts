import { TStateForm } from '../../common.types'
import Config from '../../config'
import { $60_KEY, CONF_THEME_MODE } from '../../constants'

Config.register('state', '60', $60_KEY)
/** @id 60 */
const devTwitchInputClientIdFormState: TStateForm = {
  '_id': '60',
  '_key': $60_KEY,
  '_type': 'stack',
  'props': {
    'sx': { 'p': 2, 'width': 476 },
    'spacing': 2,
  },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': {
      'backgroundColor': Config.read(CONF_THEME_MODE, 'light') 
        ? '#dddddd'
        : 'inherit'
    }
  },
  'items': [
    {
      'type': 'html',
      'props': {
        'sx': { 'textAlign': 'center' },
      },
      'has': {
        'content': '<h3>Enter Twitch Cliend ID and Secret</h3>'
      }
    },
    {
      'type': 'text',
      'name': 'client_id',
      'label': 'Client ID',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      },
      'has': {
        'required': true,
        'requiredMessage': 'Client ID is required',
      }
    },
    {
      'type': 'text',
      'name': 'client_secret',
      'label': 'Client Secret',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      },
      'has': {
        'required': true,
        'requiredMessage': 'Client Secret is required',
      }
    },
    {
      'type': 'state_button',
      'props': {
        'variant': 'contained',
        'color': 'primary',
      },
      'has': {
        'label': 'Save',
        'onclickHandle': 'tuberCallbacks.$60_C_1',
      }
    },
  ]
}

export default devTwitchInputClientIdFormState