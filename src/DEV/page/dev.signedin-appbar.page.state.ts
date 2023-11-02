import Config from '../../config'
import IStatePage from '../../../../tuber-client/src/controllers/interfaces/IStatePage'
import { $43_KEY } from '../../constants'

const $43 = '43'
/** @id 43 */
Config.register('state', $43, $43_KEY)
const devSignedInPage: IStatePage = {
  '_id': $43,
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

export default devSignedInPage