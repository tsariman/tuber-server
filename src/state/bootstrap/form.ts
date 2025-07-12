import { TStateAllForms, TThemeMode } from 'src/common.types';
import { IStateContext, TBootstrapState } from '../_state.common.types';
import Config from 'src/config';
import { $41_STATE_KEY, $47_STATE_KEY, THEME_MODE } from 'src/constants';
import { PrepareState } from '../PrepareState';
import devInstallFormState, { $47DarkThemeMode } from 'src/DEV/form/dev.install.form.state';
import signInFormState, { $41DarkThemeMode } from '../form/sign.in.form.state';

const bootstrap_forms_state: TBootstrapState<TStateAllForms> = {

  DEFAULT: (context: IStateContext): TStateAllForms => {
    const mode = context.theme ?? Config.read<TThemeMode>(THEME_MODE, Config.DEFAULT_THEME_MODE);

    switch (mode) {
      case 'dark':
        return new PrepareState<TStateAllForms>(context)
                    .process(bootstrap_forms_dark_state)
                    .get();
      default:
      case 'light':
        return new PrepareState<TStateAllForms>(context)
                    .process(bootstrap_forms_light_state)
                    .get();
    }
  }

  // TODO - Insert more form states here.
}

const bootstrap_forms_light_state: TBootstrapState<TStateAllForms> = {

  DEFAULT: (context: IStateContext): TStateAllForms => {
    const { usr } = context;
    const inDev = Config.DEV && !!usr && usr.role === 'developer';

    const lightForms: TStateAllForms = {
      [$41_STATE_KEY]: signInFormState
    };

    if (inDev) {
      lightForms[$47_STATE_KEY] = devInstallFormState;
    }

    return lightForms;
  }

  // TODO - Insert more (light themed) form states here.
};

const bootstrap_forms_dark_state: TBootstrapState<TStateAllForms> = {

  DEFAULT: (context: IStateContext): TStateAllForms => {
    const { usr } = context;
    const inDev = Config.DEV && !!usr && usr.role === 'developer';

    const darkForms: TStateAllForms = {
      [$41_STATE_KEY]: $41DarkThemeMode
    };

    if (inDev) {
      darkForms[$47_STATE_KEY] = $47DarkThemeMode;
    }

    return darkForms;
  }

  // TODO - Insert more (dark themed) form states here.
};

export { 
  bootstrap_forms_state,
  bootstrap_forms_light_state,
  bootstrap_forms_dark_state
 };