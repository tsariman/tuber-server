import Config from '../../config'
import { TStateForm } from '../../common.types'
import { $57_KEY, $58_KEY } from '../../constants'

Config.register('state', '57', $57_KEY)
/**
 * Form to test the regexp to grab the thumbnail url from
 * the html page source of an unknown platform.
 *
 * @id 57
 */
const devTestUnknownRegexpFormState = {
  '_id': '57',
  '_key': $57_KEY,
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
      },
      'has': {
        'defaultValue': '"thumbnailUrl".+?"(.+?)"'
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
        'onclickHandle': 'tuberCallbacks.$57_C_1',
      }
    },
    {
      'type': 'html',
      'props': {
        'sx': { 'textAlign': 'center' },
      },
      'has': {
        'content': 'Result: <span id="result"></span>'
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
    {
      'type': 'html',
      'props': {
        'sx': { 'textAlign': 'center' }
      },
      'has': {
        'content': `
          <img
            src="{{ thumbnailUrl }}"
            style="width: 100%"
            alt="Supposed to load thumbnail of video URL."
          />
        `,
        'key': $58_KEY
      }
    }
  ]
} as TStateForm

export default devTestUnknownRegexpFormState
