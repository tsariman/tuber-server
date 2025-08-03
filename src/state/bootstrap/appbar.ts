import { TStateAppbar } from 'src/shared';
import { TBootstrapState } from '../_state.common.types';

const bootstrap_appbar_state: TBootstrapState<TStateAppbar> = {

  DEFAULT: {
    'appbarStyle': 'mini',
    'props': {
      'elevation': 0,
      'color': 'primary',
    },
    'menuItemsSx': {
      'textTransform': 'none'
    }
  }

  // TODO - Insert more appbar states here.
};

/** @deprecated */
const bootstrap_appbar_state_light = {

  DEFAULT: {}

  // TODO - Insert more (light themed) appbar states here.
};

/** @deprecated */
const bootstrap_appbar_state_dark = {

  DEFAULT: {}

  // TODO - Insert more (dark themed) appbar states here.
};

export {
  bootstrap_appbar_state,
  bootstrap_appbar_state_light,
  bootstrap_appbar_state_dark
};
