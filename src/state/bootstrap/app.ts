import { IStateContext, TBootstrapState } from '../_state.common.types'
import Config from '../../config'
import { TStateApp } from '@tuber/shared'
import STATE_KEY from '../../business.logic/state.key'

const $40 = STATE_KEY['40']
const $44 = STATE_KEY['44']

const bootstrap_app_state = {

    DEFAULT: (context: IStateContext) => {
      const { usr, theme: themeMode } = context;
      const inDev = Config.DEV && !!usr && usr.role === 'developer';
      const app: TStateApp = {
        'fetchingStateAllowed': true,
        'inDebugMode': inDev,
        'inDevelMode': inDev,
        // 'logoUri': '../tuber.png', // TODO Uncomment when logo is ready
        // 'logoWidth': 212,
        // 'logoHeight': 35,
        'title': Config.DEV ? `[DEV] TubeResearch` : `TubeResearch`,
        'homepage': inDev ? $44 : $40, // gives developers a different homepage
        'themeMode': themeMode,
        'isBootstrapped': true
      }

      return app
    }

    // TODO - Insert more app states here.

} as TBootstrapState<TStateApp>

export { bootstrap_app_state }
