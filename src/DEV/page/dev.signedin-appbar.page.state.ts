import type { TStatePage } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { clone_with_descriptors } from '../../business.logic'
import { homeLinkState } from '../../state/nav.link'
import STATE_KEY from '../../business.logic/state.key'

const $43 = STATE_KEY['43']

register('state', '43', $43)
/** @id 43 */
const devSignedInPageState: TStatePage = {
  '_id': '43',
  '_key': $43,
  'appbar': {
    'items': [
      homeLinkState,

      // sign in chip
      {
        'has': {}
      }
    ]
  }
}

export default devSignedInPageState

/** Dark theme mode for dev signed in page state. @id 43 */
export const $43DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(devSignedInPageState)
  return base
})()
