import { EP_AUTH, type TStatePage } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import {
  clone_as_collection,
  clone_with_descriptors,
  remove_form_suffix,
  t
} from '../../business.logic'
import { defaultAppBarState } from '../default.content'
import { IBootstrapThemed, IStateContext } from '../_state.common.types'
import { homeLinkState } from '../nav.link'
import STATE_KEY from '../../business.logic/state.key'

const $89 = STATE_KEY['89']
const $90 = STATE_KEY['90']

register('state', '90', $90)
/** Page state for password reset. @id 90 */
export const passwordResetPageState: TStatePage = {
  '_id': '90',
  '_key': $90,
  get 'title'() { return t('reset_password_title', 'Reset Password') },
  'appbar': (() => {
    const base = clone_with_descriptors(defaultAppBarState)
    base.appbarStyle = 'basic'
    const link = clone_as_collection(base.items)
    link.add(homeLinkState)
    base.items = link.items
    return base
  })(),
  'content': `$form : ${remove_form_suffix($89)} : ${EP_AUTH.RESET}`,
  'layout': 'layout_centered'
}

export default passwordResetPageState

/** Dark theme mode for password reset page. @id 90 */
export const $90DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(passwordResetPageState)
  return base
})()

/** Bootstrap-ready light and dark themed password reset page. @id 90 */
export const bs_resetPasswordPageState = (
  context: IStateContext
): IBootstrapThemed<TStatePage> => {
  void context
  return {
    'dark': (() => {
      const base = clone_with_descriptors($90DarkThemeMode)
      return base
    })(),
    'light': (() => {
      const base = clone_with_descriptors(passwordResetPageState)
      return base
    })()
  }
}
