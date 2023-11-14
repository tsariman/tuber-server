import Config from '../../config'
import { TStateForm } from '../../common.types'
import { $54_KEY } from '../../constants'

Config.register('state', '54', $54_KEY)
/**
 * Form to test the regexp to grab both the video id and the thumbnail url from
 * the rumble video index.html page.
 *
 * @id 54
 */
const devTestRumbleRegexpFormState = {
  '_id': '54',
  '_key': $54_KEY,
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
      'type': 'text',
      'name': 'url',
      'label': 'URL',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      }
    },
    {
      'type': 'text',
      'name': 'regexp',
      'label': 'Regular expression',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      }
    },
    {
      'type': 'state_button',
      'props': {
        'variant': 'contained',
        'color': 'primary',
      },
      'has': {
        'label': 'Test',
        'onclickHandle': 'tuberCallbacks.$54_C_1',
      }
    }
  ]
} as TStateForm

export default devTestRumbleRegexpFormState
