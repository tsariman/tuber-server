import { TStatePage } from '../../common.types'
import Config from '../../config'
import { $43_STATE_KEY } from '../../constants'

/** @id 43 */
Config.register('state', '43', $43_STATE_KEY)
const devSignedInPageState: TStatePage = {
  '_id': '43',
  '_key': $43_STATE_KEY,
  'appBar': {
    'items': [
      {
        'has': {
          'text': 'Home',
          'route': '/'
        }
      },

      // sign in chip
      {
        'has': {}
      }
    ]
  }
}

export default devSignedInPageState

/** Dark theme mode for dev signed in page state. @id 43 */
export const $43DarkThemeMode: TStatePage = {
  ...devSignedInPageState,
}