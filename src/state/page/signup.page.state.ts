import { $69_STATE_KEY, $72_STATE_KEY, TStatePage } from '@tuber/shared';
import { register } from '../../business.logic/registry';
import { clone_with_descriptors, remove_form_suffix } from '../../business.logic';
import { defaultPageAppbarState } from '../appbar';

register('state', '72', $72_STATE_KEY);
/** Page state for form to signup. @id 72 */
export const signupPageState: TStatePage = {
  '_id': '72',
  '_key': $72_STATE_KEY,
  'title': 'Sign Up',
  'appbar': clone_with_descriptors(defaultPageAppbarState),
  'content': `$form : ${remove_form_suffix($69_STATE_KEY)} : signup`
};