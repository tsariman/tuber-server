import { TStateAppbar } from '../../common.types';

/** Default app bar json. */
export const defaultAppBarState: TStateAppbar = {
  'appbarStyle': 'mini',
  'props': {
    'elevation': 0,
    'color': 'primary',
  },
  'menuItemsSx': {
    'textTransform': 'none'
  }
};

/** @deprecated */
export function bootstrap_default_appbar_state(): TStateAppbar {
  return {
    ...defaultAppBarState
  };
}