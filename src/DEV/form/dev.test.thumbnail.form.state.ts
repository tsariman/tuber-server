import { TStateForm } from '../../common.types'
import Config from '../../config'
import {
  $45_KEY,
  $46_KEY,
  THEME_DARK_PAPER_COLOR,
  THEME_LIGHT_PAPER_COLOR
} from '../../constants'

Config.register('state', '45', $45_KEY)
/** @id 45 */
const devTestThumbnailFormState: TStateForm = {
  '_type': 'box',
  '_id': '45',
  '_key': $45_KEY,
  'props': {
    'sx': { 'p': 2, 'width': 476 },
  },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': { 'backgroundColor': THEME_LIGHT_PAPER_COLOR }
  },
  'items': [
    {
      'type': 'text',
      'name': 'video_url',
      'label': 'Paste Video URL Here ...',
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
        'label': 'Get Thumbnail',
        'onclickHandle': 'tuberCallbacks.$45_C_1'
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
        'key': $46_KEY
      }
    }
  ]
}

export default devTestThumbnailFormState

export const $45DarkThemeMode = {
  ...devTestThumbnailFormState,
  'paperProps': {
    ...devTestThumbnailFormState.paperProps,
    'sx': { 'backgroundColor': THEME_DARK_PAPER_COLOR }
  },
} as TStateForm
