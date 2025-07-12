import { TBootstrapState } from 'src/state/_state.common.types';
import { TStateForm } from '../../common.types';
import Config from '../../config';
import {
  $62_STATE_KEY,
  THEME_LIGHT_PAPER_COLOR,
  THEME_DARK_PAPER_COLOR
} from '../../constants';
import { $26DarkThemeMode } from 'src/state/dialog/new.facebook.dialog';

Config.register('state', '62', $62_STATE_KEY);
/** @id 62 @deprecated */
const devSaveConfigValueFormState: TStateForm = {
  '_id': '62',
  '_key': $62_STATE_KEY,
  '_type': 'stack',
  'props': {
    'sx': { 'p': 2, 'width': 476 },
    'spacing': 2,
  },
  'paperBackground': true,
  'paperProps': {
    'elevation': 0,
    'sx': {
      'backgroundColor': THEME_LIGHT_PAPER_COLOR
    }
  },
  'items': [
    {
      'type': 'text',
      'name': 'key',
      'label': 'Key',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      },
      'has': {
        'required': true,
        'requiredMessage': 'Key is required',
      }
    },
    {
      'type': 'text',
      'name': 'value',
      'label': 'Value',
      'props': {
        'fullWidth': true,
        'variant': 'standard'
      },
      'has': {
        'required': true,
        'requiredMessage': 'Value is required',
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
        'onclickHandle': 'tuberCallbacks.$62_C_1',
      }
    },
  ]
};

export default devSaveConfigValueFormState;

/** @deprecated */
export const $62DarkThemeMode = {
  ...devSaveConfigValueFormState,
  'paperProps': {
    ...devSaveConfigValueFormState.paperProps,
    'sx': { 'backgroundColor': THEME_DARK_PAPER_COLOR }
  },
} as TStateForm;

export const dev_save_config_value_form_state = {

  [$62_STATE_KEY]: devSaveConfigValueFormState,

  // TODO - Instert more form states here.

} as TBootstrapState<TStateForm>;

export const dev_save_config_value_form_state_dark = {

  [$62_STATE_KEY]: $26DarkThemeMode,

  // TODO - Insert more form states (dark themed) here.

} as TBootstrapState<TStateForm>;