import { TStateAllIcons } from 'src/common.types';
// import { is_dev } from 'src/model/user/access';
// import { TCipheredUser } from 'src/schema/users';
import { IStateContext, TBootstrapState } from "../_state.common.types";

export const bootstrap_icons_state = {

  DEFAULT: (_context: IStateContext) => {

    const icons: TStateAllIcons = {
      // source: https://fonts.google.com/icons?selected=Material+Icons:vpn_key:&icon.query=vpn&icon.size=24&icon.color=%23e3e3e3
      'vpn_key': {
        'paths': [
          { 'd': 'M0 0h24v24H0z', 'fill': 'none' },
          { 'd': 'M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z' }
        ],
        'fill': 'currentColor',
        'viewBox': '0 0 24 24',
        'height': 24,
        'width': 24
      },
    }

    return icons;
  }

  // TODO - If you want to use an icon, insert its state here.
  //        It will then be available client-side.

} as TBootstrapState<TStateAllIcons>;
