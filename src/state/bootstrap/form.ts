import { IStateContext, TBootstrapState } from '../_state.common.types'
import Config from '../../config'
import { TStateAllForms } from '@tuber/shared'
import Access from '../../business.logic/security/Access'
import { PrepareState } from '../PrepareState'
import devInstallFormState, {
  $47DarkThemeMode
} from '../../dev/form/dev.install.form.state'
import signInFormState, { $41DarkThemeMode } from '../form/sign.in.form.state'
import passwordRecoveryFormState, { $86DarkThemeMode } from '../form/password.recovery.form.state'
import passwordResetFormState, { $89DarkThemeMode } from '../form/password.reset.form.state'
import newUserFormState, { $69DarkThemeMode } from '../form/new.user.form.state'
import STATE_KEY from '../../business.logic/state.key'

const $41 = STATE_KEY['41']
const $47 = STATE_KEY['47']
const $69 = STATE_KEY['69']
const $86 = STATE_KEY['86']
const $89 = STATE_KEY['89']

const bootstrap_forms_state: TBootstrapState<TStateAllForms> = {

  DEFAULT: (context: IStateContext): TStateAllForms => {
    const { theme: themeMode } = context
    if (!themeMode) {
      throw new Error('State bootstrap requires context.theme.')
    }

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
    const inDev = Config.DEV && Access.the(usr).can('dev_install_page.view')

    const lightForms: TStateAllForms = {
      [$41]: signInFormState,
      [$86]: passwordRecoveryFormState,
      [$89]: passwordResetFormState,
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
    const inDev = Config.DEV && Access.the(usr).can('dev_install_page.view')

    const darkForms: TStateAllForms = {
      [$41]: $41DarkThemeMode,
      [$86]: $86DarkThemeMode,
      [$89]: $89DarkThemeMode,
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