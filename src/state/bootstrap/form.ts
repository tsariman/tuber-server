import { TThemeMode } from '../../common.types'
import { IStateContext, TBootstrapState } from '../_state.common.types'
import Config from '../../config'
import { TStateAllForms, THEME_MODE } from '@tuber/shared'
import { PrepareState } from '../PrepareState'
import devInstallFormState, {
  $47DarkThemeMode
} from '../../dev/form/dev.install.form.state'
import signInFormState, { $41DarkThemeMode } from '../form/sign.in.form.state'
import newUserFormState, { $69DarkThemeMode } from '../form/new.user.form.state'
import STATE_KEY from '../../business.logic/state.key'

const $41 = STATE_KEY['41']
const $47 = STATE_KEY['47']
const $69 = STATE_KEY['69']

const bootstrap_forms_state: TBootstrapState<TStateAllForms> = {

  DEFAULT: (context: IStateContext): TStateAllForms => {
    const themeMode = context.theme ?? Config.read<TThemeMode>(THEME_MODE, Config.DEFAULT_THEME_MODE)

    switch (themeMode) {
      case 'dark':
        return new PrepareState<TStateAllForms>(context)
                    .process(bootstrap_forms_dark_state)
                    .get()
      default:
      case 'light':
        return new PrepareState<TStateAllForms>(context)
                    .process(bootstrap_forms_light_state)
                    .get()
    }
  }

  // TODO - Insert more form states here.
}

const bootstrap_forms_light_state: TBootstrapState<TStateAllForms> = {

  DEFAULT: (context: IStateContext): TStateAllForms => {
    const { usr } = context
    const inDev = Config.DEV && !!usr && usr.role === 'developer'

    const lightForms: TStateAllForms = {
      [$41]: signInFormState,
      [$69]: newUserFormState
    }

    if (inDev) {
      lightForms[$47] = devInstallFormState
    }

    return lightForms
  }

  // TODO - Insert more (light themed) form states here.
}

const bootstrap_forms_dark_state: TBootstrapState<TStateAllForms> = {

  DEFAULT: (context: IStateContext): TStateAllForms => {
    const { usr } = context
    const inDev = Config.DEV && !!usr && usr.role === 'developer'

    const darkForms: TStateAllForms = {
      [$41]: $41DarkThemeMode,
      [$69]: $69DarkThemeMode
    }

    if (inDev) {
      darkForms[$47] = $47DarkThemeMode
    }

    return darkForms
  }

  // TODO - Insert more (dark themed) form states here.
}

export { 
  bootstrap_forms_state,
  bootstrap_forms_light_state,
  bootstrap_forms_dark_state
 }