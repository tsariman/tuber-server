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
    },
    {
      'type': 'html',
      'props': {
        'sx': { 'textAlign': 'center' },
      },
      'has': {
        'content': '<h3>Result of Regular Expression</h3>'
      }
    },
    {
      'type': 'text',
      'name': 'videoid',
      'label': 'Video ID',
      'props': {
        'fullWidth': true,
        'variant': 'filled'
      },
      'inputProps': {
        'readOnly': true
      }
    },
    {
      'type': 'text',
      'name': 'thumbnail_url',
      'label': 'Thumbnail URL',
      'props': {
        'fullWidth': true,
        'variant': 'filled'
      },
      'inputProps': {
        'readOnly': true
      }
    },
  ]
} as TStateForm

export default devTestRumbleRegexpFormState
