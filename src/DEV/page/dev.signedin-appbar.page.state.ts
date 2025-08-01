import { TStatePage } from '../../common.types';
import { register } from '../../business.logic/registry';
import { $43_STATE_KEY } from '../../constants';

register('state', '43', $43_STATE_KEY);
/** @id 43 */
const devSignedInPageState: TStatePage = {
  '_id': '43',
  '_key': $43_STATE_KEY,
  'appbar': {
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
};

export default devSignedInPageState;

/** Dark theme mode for dev signed in page state. @id 43 */
export const $43DarkThemeMode: TStatePage = {
  ...devSignedInPageState,
};