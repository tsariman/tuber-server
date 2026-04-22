import { type TStatePage } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import {
  clone_as_collection,
  clone_with_descriptors,
} from '../../business.logic'
import { defaultAppBarState } from '../default.content'
import { homeLinkState } from '../nav.link'
import STATE_KEY from '../../business.logic/state.key'

const $91 = STATE_KEY['91']

register('state', '91', $91)
/** Page state for the Privacy Policy page. @id 91 */
export const privacyPolicyPageState: TStatePage = {
  '_id': '91',
  '_key': $91,
  'appbar': (() => {
    const base = clone_with_descriptors(defaultAppBarState)
    base.appbarStyle = 'basic'
    const link = clone_as_collection(base.items)
    link.add(homeLinkState)
    base.items = link.items
    return base
  })(),
  'content': '$html : privacy-policy',
  'layout': 'layout_md',
  'hideDrawer': true
}

export default privacyPolicyPageState

/** Dark theme mode for Privacy Policy page. @id 91 */
export const $91DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(privacyPolicyPageState)
  return base
})()
