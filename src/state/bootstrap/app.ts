import { TStateApp } from 'src/common.types';
import { IStateContext, TBootstrapState } from '../_state.common.types';
import Config from 'src/config';
import { $40_STATE_KEY, $44_STATE_KEY } from 'src/constants';

const bootstrap_app_state = {

    DEFAULT: (context: IStateContext) => {
      const { usr, theme: mode } = context;
      const inDev = Config.DEV && !!usr && usr.role === 'developer';
      const app: TStateApp = {
        'fetchingStateAllowed': true,
        'inDebugMode': inDev,
        'inDevelMode': inDev,
        'logoUri': '../tuber.png',
        // 'logoWidth': 212,
        // 'logoHeight': 35,
        'title': Config.DEV ? `[DEV] Tuberesearcher` : `Tuberesearcher`,
        'homepage': inDev ? $44_STATE_KEY : $40_STATE_KEY, // gives developers a different homepage
        'themeMode': mode,
        'isBootstrapped': true
      };

      return app;
    }

    // TODO - Insert more app states here.

} as TBootstrapState<TStateApp>;

export { bootstrap_app_state };
