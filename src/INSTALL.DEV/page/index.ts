import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'
import Config from '../../config'
import { $44_KEY } from './dev.install.page.state'

const $46 = '46'
const $46_KEY = 'dev-test-thumbnail'
Config.register('state', $46, $46_KEY)
const devTestThumbnailPageState: IStatePage = {
  '_id': $46,
  '_key': $46_KEY,
  'appBar': {
    'items': [
      {
        'has': {
          'text': 'Back',
          'route': $44_KEY
        }
      }
    ]
  },
  'content': '$form : devTestThumbnail : '
}

export default devTestThumbnailPageState