import type { TStatePage } from '@tuber/shared'
import { register } from '../../business.logic/registry'
import { clone_with_descriptors, remove_form_suffix } from '../../business.logic'
import { defaultPageAppbarState } from '../appbar'
import STATE_KEY from '../../business.logic/state.key'

const $69 = STATE_KEY['69']
const $72 = STATE_KEY['72']

register('state', '72', $72)
/** Page state for form to signup. @id 72 */
export const signupPageState: TStatePage = {
  '_id': '72',
  '_key': $72,
  'title': 'Sign Up',
  'appbar': clone_with_descriptors(defaultPageAppbarState),
  'content': `$form : ${remove_form_suffix($69)} : signup`
}