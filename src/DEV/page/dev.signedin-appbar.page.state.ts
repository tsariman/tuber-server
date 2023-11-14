import { TStatePage } from '../../common.types'
import Config from '../../config'
import { $43_KEY } from '../../constants'

/** @id 43 */
Config.register('state', '43', $43_KEY)
const devSignedInPageState: TStatePage = {
  '_id': '43',
  '_key': $43_KEY,
  'appBar': {
    'items': [
      {
        'has': {
          'text': 'Home',
          'route': '/'
        }
      },

      // Login chip
      {
        'has': {}
      }
    ]
  }
}

export default devSignedInPageState