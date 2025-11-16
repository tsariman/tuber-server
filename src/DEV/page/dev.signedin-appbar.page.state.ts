import { $43_STATE_KEY, TStatePage } from '@tuber/shared';
import { register } from '../../business.logic/registry';
import { clone_with_descriptors } from '../../business.logic';
import { homeLinkState } from '../../state/nav.link';

register('state', '43', $43_STATE_KEY);
/** @id 43 */
const devSignedInPageState: TStatePage = {
  '_id': '43',
  '_key': $43_STATE_KEY,
  'appbar': {
    'items': [
      homeLinkState,

      // sign in chip
      {
        'has': {}
      }
    ]
  }
};

export default devSignedInPageState;

/** Dark theme mode for dev signed in page state. @id 43 */
export const $43DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(devSignedInPageState);
  return base;
})();
