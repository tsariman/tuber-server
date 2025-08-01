import { TBootstrapState } from 'src/state/_state.common.types';
import { TStateForm } from '../../common.types';
import { register } from '../../business.logic/registry';
import {
  $60_STATE_KEY,
  THEME_LIGHT_PAPER_COLOR,
  THEME_DARK_PAPER_COLOR
} from '../../constants';

register('state', '60', $60_STATE_KEY);
/** @id 60 */
const devTwitchInputClientIdFormState: TStateForm = {
  '_id': '60',
  '_key': $60_STATE_KEY,
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
      'type': 'html',
      'props': {
        'sx': { 'textAlign': 'center' },
      },
      'has': {
        'content': '<h3>Enter Twitch Cliend ID and Secret</h3>'
      }
    },
    {
      'type': 'text',
      'name': 'client_id',
      'label': 'Client ID',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      },
      'has': {
        'required': true,
        'requiredMessage': 'Client ID is required',
      }
    },
    {
      'type': 'text',
      'name': 'client_secret',
      'label': 'Client Secret',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      },
      'has': {
        'required': true,
        'requiredMessage': 'Client Secret is required',
      }
    },
    {
      'type': 'state_button',
      'props': {
        'variant': 'contained',
        'color': 'primary',
      },
      'has': {
        'label': 'Save',
        'onclickHandle': 'tuberCallbacks.$60_C_1',
      }
    },
  ]
};

export default devTwitchInputClientIdFormState;

export const $60DarkThemeMode = {
  ...devTwitchInputClientIdFormState,
  'paperProps': {
    ...devTwitchInputClientIdFormState.paperProps,
    'sx': { 'backgroundColor': THEME_DARK_PAPER_COLOR }
  },
} as TStateForm;

export const dev_twitch_input_client_id_form_state = {

  [$60_STATE_KEY]: devTwitchInputClientIdFormState,

  // TODO - Insert more form states here.

} as TBootstrapState<TStateForm>;

export const dev_twitch_input_client_id_form_state_dark = {

  [$60_STATE_KEY]: $60DarkThemeMode,

  // TODO - Insert more (dark themed) form states here.

} as TBootstrapState<TStateForm>;