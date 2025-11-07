import { clone_with_descriptors } from 'src/business.logic';
import { register } from '../../business.logic/registry';
import {
  $50_STATE_KEY,
  THEME_DARK_PAPER_COLOR,
  THEME_LIGHT_PAPER_COLOR
} from '@tuber/shared';
import { TStateForm } from '../../shared';
import { TBootstrapState } from 'src/state/_state.common.types';

register('state', '50', $50_STATE_KEY);
/** Form to set the authorization URL for a platform. @id 50 */
const devSetAuthorizationUrlFormState: TStateForm = {
  '_id': '50',
  '_key': $50_STATE_KEY,
  '_type': 'stack',
  'props': {
    'sx': { 'p': 2, 'width': 476 },
    'spacing': 2,
  },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': { 'backgroundColor': THEME_LIGHT_PAPER_COLOR }
  },
  'items': [
    {
      'type': 'state_select',
      'name': 'platform',
      'label': 'Choose platform',
      'props': { 'variant': 'standard' },
      'has': {
        'formControlProps': { 'fullWidth': true },
        'items': [
          { 'label': 'Twitch', 'value': 'twitch' },
          { 'label': 'YouTube', 'value': 'youtube' },
          { 'label': 'Vimeo', 'value': 'vimeo' },
          { 'label': 'Dailymotion', 'value': 'dailymotion' },
          { 'label': 'Rumble', 'value': 'rumble' },
          { 'label': 'Odysee', 'value': 'odysee' },
          { 'label': 'Facebook', 'value': 'facebook' },
          { 'label': 'Bitchute', 'value': 'bitchute' }
        ]
      }
    },
    {
      'type': 'text',
      'name': 'purpose',
      'label': 'Purpose',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      }
    },
    {
      'type': 'text',
      'name': 'url',
      'label': 'URL',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      }
    },
    {
      'type': 'state_button',
      'props': {
        'sx': { 'width': '100%' }
      },
      'has': {
        'label': 'Set Authorization URL',
        'onclickHandle': 'tuberCallbacks.$50_C_1'
      }
    },
  ]
};

export default devSetAuthorizationUrlFormState;

export const $50DarkThemeMode: TStateForm = (() => {
  const base = clone_with_descriptors(devSetAuthorizationUrlFormState);
  const paperProps = clone_with_descriptors(base.paperProps ?? {});
  paperProps.sx = {
    ...paperProps.sx,
    'backgroundColor': THEME_DARK_PAPER_COLOR
  };
  base.paperProps = paperProps;
  return base;
})();

export const dev_set_authorization_url_form_state = {

  [$50_STATE_KEY]: devSetAuthorizationUrlFormState,

  // TODO - Insert more form states here.

} as TBootstrapState<TStateForm>;

export const dev_set_authorization_url_form_state_dark = {

  [$50_STATE_KEY]: $50DarkThemeMode,

  // TODO - Insert more form states (dark themed) here.

} as TBootstrapState<TStateForm>;
