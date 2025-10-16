import { $74_STATE_KEY, $69_STATE_KEY } from '../../constants.server';
import { register } from '../../business.logic/registry';
import { TStatePage } from '../../shared';
import {
  clone_with_descriptors,
  remove_form_suffix,
  t
} from '../../business.logic';
import { defaultAppBarState } from '../default.content';
import { IBootstrapThemed, IStateContext } from '../_state.common.types';
import { homeLinkState } from '../nav.link';

register('state', '74', $74_STATE_KEY);
/** Page state to create a new user. @id 74 */
export const newUserPageState: TStatePage = {
  '_id': '74',
  '_key': $74_STATE_KEY,
  get 'title'() { return t('newaccount', 'Create a New Account'); },
  'appbar': (() => {
    const base = clone_with_descriptors(defaultAppBarState);
    base.items?.push(homeLinkState);
    return base;
  })(),
  'content': `$form : ${remove_form_suffix($69_STATE_KEY)} : ${$74_STATE_KEY}`
};

/** Dark theme mode for page to create new account. @id 74 */
export const $74DarkThemeMode: TStatePage = (() => {
  const base = clone_with_descriptors(newUserPageState);

  return base;
})();

/** Bootstrap-ready light and dark themed page to create new account. @id 74 */
export const bs_newUserPageState = (
  context: IStateContext
): IBootstrapThemed<TStatePage> => {
  void context;
  return {
    'dark': (() => {
      const base = clone_with_descriptors($74DarkThemeMode);
      return base;
    })(),
    'light': (() => {
      const base = clone_with_descriptors(newUserPageState);
      return base;
    })()
  }
}
