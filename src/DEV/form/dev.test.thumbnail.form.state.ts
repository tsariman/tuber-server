import Config from '../../config'
import IStateForm from '../../../../tuber-client/src/controllers/interfaces/IStateForm'
import { $45_KEY, $46_KEY } from '../../constants'

const $45 = '45'
Config.register('state', $45, $45_KEY)
/** @id 45 */
const devTestThumbnailFormState: IStateForm = {
  '_type': 'box',
  '_id': $45,
  '_key': $45_KEY,
  'props': { 'p': 2, 'width': 476 },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': { 'backgroundColor': '#dddddd' }
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
            src="{{ imgUrl }}"
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