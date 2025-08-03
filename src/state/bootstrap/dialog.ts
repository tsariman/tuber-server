import { TStateAllDialogs } from '../../shared';
import { TThemeMode } from '../../common.types';
import { IStateContext, TBootstrapState } from '../_state.common.types';
import Config from '../../config';
import { $32_STATE_KEY, $68_STATE_KEY, THEME_MODE } from 'src/constants.server';
import { PrepareState } from '../PrepareState';
import {
  $32DarkThemeMode,
  $68DarkThemeMode,
  confirmSignOutDialogState,
  signInDialogState
} from '../dialog';

const bootstrap_dialogs_state: TBootstrapState<TStateAllDialogs> = {

  DEFAULT: (context: IStateContext): TStateAllDialogs => {
    const mode = context.theme ?? Config.read<TThemeMode>(THEME_MODE, Config.DEFAULT_THEME_MODE);

    switch (mode) {
      case 'dark':
        return new PrepareState<TStateAllDialogs>(context)
                    .process(bootstrap_dialogs_dark_state)
                    .get();
      default:
      case 'light':
        return new PrepareState<TStateAllDialogs>(context)
                    .process(bootstrap_dialogs_light_state)
                    .get();
    }
  }

  // TODO - Insert more dialog states here.
};

const bootstrap_dialogs_light_state: TBootstrapState<TStateAllDialogs> = {

  DEFAULT: {
    [$32_STATE_KEY]: signInDialogState,
    [$68_STATE_KEY]: confirmSignOutDialogState
  }

  // TODO - Insert more (light themed) dialog states here.
}

const bootstrap_dialogs_dark_state: TBootstrapState<TStateAllDialogs> = {

  DEFAULT: {
    [$32_STATE_KEY]: $32DarkThemeMode,
    [$68_STATE_KEY]: $68DarkThemeMode
  }

  // TODO - Insert more (dark themed) dialog states here.
}

export {
  bootstrap_dialogs_state,
  bootstrap_dialogs_light_state,
  bootstrap_dialogs_dark_state
};