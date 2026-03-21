import { TStateAllDialogs } from '@tuber/shared'
import { IStateContext, TBootstrapState } from '../_state.common.types'
import { PrepareState } from '../PrepareState'
import {
  $32DarkThemeMode,
  $68DarkThemeMode,
  confirmSignOutDialogState,
  signInDialogState
} from '../dialog'
import STATE_KEY from '../../business.logic/state.key'

const $32 = STATE_KEY['32']
const $68 = STATE_KEY['68']

const bootstrap_dialogs_state: TBootstrapState<TStateAllDialogs> = {

  DEFAULT: (context: IStateContext): TStateAllDialogs => {
    const { theme: themeMode } = context
    if (!themeMode) {
      throw new Error('State bootstrap requires context.theme.')
    }

    switch (themeMode) {
      case 'dark':
        return new PrepareState<TStateAllDialogs>(context)
                    .process(bootstrap_dialogs_dark_state)
                    .get()
      default:
      case 'light':
        return new PrepareState<TStateAllDialogs>(context)
                    .process(bootstrap_dialogs_light_state)
                    .get()
    }
  }

  // TODO - Insert more dialog states here.
}

const bootstrap_dialogs_light_state: TBootstrapState<TStateAllDialogs> = {

  DEFAULT: {
    [$32]: signInDialogState,
    [$68]: confirmSignOutDialogState
  }

  // TODO - Insert more (light themed) dialog states here.
}

const bootstrap_dialogs_dark_state: TBootstrapState<TStateAllDialogs> = {

  DEFAULT: {
    [$32]: $32DarkThemeMode,
    [$68]: $68DarkThemeMode
  }

  // TODO - Insert more (dark themed) dialog states here.
}

export {
  bootstrap_dialogs_state,
  bootstrap_dialogs_light_state,
  bootstrap_dialogs_dark_state
}