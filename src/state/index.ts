import { TStateAppbar, TStateBackground } from '../common.types';

/** Directive used to remove states client-side. */
export const NET_STATE_PATCH_DELETE = '<#DEL>';

/** Gray background for page @deprecated */
export const backgroundState: TStateBackground = {
  'color': 'inherit'
};

/** Get the default background state. @deprecated */
export function bootstrap_background_state(): TStateBackground {
  return {
    'color': 'inherit'
  };
}

// Grey app bar with text-transform disabled
export const appbarState: TStateAppbar = {
  'props': { 'elevation': 0 },
  'menuItemsSx': {
    'textTransform': 'none'
  }
};
