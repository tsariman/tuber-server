import { TStateForm } from '../../common.types'
import Config from '../../config'
import { $62_KEY, CONF_THEME_MODE } from '../../constants'

Config.register('state', '62', $62_KEY)
/** @id 62 */
const devSaveConfigValueFormState: TStateForm = {
  '_id': '62',
  '_key': $62_KEY,
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
      'type': 'text',
      'name': 'key',
      'label': 'Key',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      },
      'has': {
        'required': true,
        'requiredMessage': 'Key is required',
      }
    },
    {
      'type': 'text',
      'name': 'value',
      'label': 'Value',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      },
      'has': {
        'required': true,
        'requiredMessage': 'Value is required',
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
        'onclickHandle': 'tuberCallbacks.$62_C_1',
      }
    },
  ]
}

export default devSaveConfigValueFormState