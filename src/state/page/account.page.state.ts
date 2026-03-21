import { EP_ACCOUNT, TStatePage } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import STATE_KEY from '../../business.logic/state.key'
import {
  clone_as_collection,
  clone_with_descriptors,
  remove_form_suffix,
  t
} from '../../business.logic'
import { defaultAppBarState } from '../default.content'
import { homeLinkState } from '../nav.link'
import { IBootstrapThemed, IStateContext } from '../_state.common.types'

const $80 = STATE_KEY['80']
const $82 = STATE_KEY['82']

register('state', '80', $80)
/** Account page state @id 80 */
const accountPageState: TStatePage = {
  '_id': '80',
  '_key': $80,
  get 'title'() { return t('account', 'Account') },
  'appbar': (() => {
    const base = clone_with_descriptors(defaultAppBarState)
    base.appbarStyle = 'basic'
    const link = clone_as_collection(base.items)
    link.add(homeLinkState)
    base.items = link.items
    return base
  })(),
  'content': `$form : ${remove_form_suffix($82)} : ${EP_ACCOUNT}`,
  'layout': 'layout_centered',
}

/** Dark theme mode for account page. @id 80 */
export const $80DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(accountPageState)
  return base
})()

/** Bootstrap-ready light and dark themed account page. @id 80 */
export const bs_accountPageState = (
  context: IStateContext
): IBootstrapThemed<TStatePage> => {
  void context
  return {
    'dark': (() => {
      const base = clone_with_descriptors($80DarkThemeMode)
      return base
    })(),
    'light': (() => {
      const base = clone_with_descriptors(accountPageState)
      return base
    })()
  }
}

export default accountPageState