import { TThemeMode } from 'src/common.types';
import { IStateContext, TBootstrapState } from '../_state.common.types';
import { PrepareState } from '../PrepareState';
import {
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  THEME_LIGHT_APP_BAR_COLOR,
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_MODE
} from 'src/constants';
import Config from '../../config';
import { ThemeOptions } from '@mui/material';

const bootstrap_theme_light_state: TBootstrapState<ThemeOptions> = {

  DEFAULT: {
    'components': {
      'MuiDrawer': {
        'styleOverrides': {
          'paper': {
            'backgroundColor': THEME_LIGHT_BACKGROUND_COLOR,
            'borderLeft': 'none',
            'borderRight': 'none'
          },
        },
      },
      'MuiAppBar': {
        'styleOverrides': {
          'colorPrimary': {
            'color': THEME_LIGHT_APP_BAR_COLOR,
            'backgroundColor': THEME_LIGHT_BACKGROUND_COLOR
          },
        },
      },
      'MuiDialogContentText': {
        'styleOverrides': {
          'root': {
            'paddingTop': 8
          }
        }
      },
      'MuiButton': {
        'styleOverrides': {
          'root': {
            'textTransform': 'none',
            'fontSize': '1rem'
          }
        }
      }
    },
    'palette': {
      'background': {
        'default': THEME_LIGHT_BACKGROUND_COLOR
      },
      'secondary': {
        'main': '#ef6c00'
      },
    },
    'typography': {
      'fontFamily': '\'Quicksand\', sans-serif'
    }
  }

  // TODO - Insert more (light) theme states here.
}

const bootstrap_theme_dark_state: TBootstrapState<ThemeOptions> = {

  DEFAULT: {
    'components': {
      'MuiDrawer': {
        'styleOverrides': {
          'paper': {
            'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR,
            'borderLeft': 'none',
            'borderRight': 'none'
          },
        },
      },
      'MuiAppBar': {
        'styleOverrides': {
          'colorPrimary': {
            'color': 'inherit',
            'backgroundColor': THEME_DARK_DIALOG_BACKGROUND_COLOR
          },
        },
      },
      'MuiDialogContentText': {
        'styleOverrides': {
          'root': {
            'paddingTop': 8
          }
        }
      },
      'MuiButton': {
        'styleOverrides': {
          'root': {
            'textTransform': 'none',
            'fontSize': '1rem'
          }
        }
      }
    },
    'palette': {
      'mode': 'dark',
      'background': {
        'default': THEME_DARK_DIALOG_BACKGROUND_COLOR
      },
      'grey': {
        '50': '#212121',
        '100': '#424242',
        '200': '#616161',
        '300': '#757575',
        '400': '#9e9e9e',
        '500': '#bdbdbd',
        '600': '#e0e0e0',
        '700': '#eeeeee',
        '800': '#f5f5f5',
        '900': '#fafafa',
        'A100': '#d5d5d5',
        'A200': '#aaaaaa',
        'A400': '#303030',
        'A700': '#616161'
      }
    },
    'typography': {
      'fontFamily': '\'Quicksand\', sans-serif'
    }
  }

  // TODO - Insert more (dark) theme states here.
}

const bootstrap_theme_state: TBootstrapState<ThemeOptions> = {

  DEFAULT: (context: IStateContext): ThemeOptions => {

    const mode = context.theme ?? Config.read<TThemeMode>(THEME_MODE, Config.DEFAULT_THEME_MODE);

    switch (mode) {
      case 'dark':
        return new PrepareState<ThemeOptions>(context)
                .process(bootstrap_theme_dark_state)
                .get();
      default:
      case 'light':
        return new PrepareState<ThemeOptions>(context)
                .process(bootstrap_theme_light_state)
                .get();
    }

  }

  // TODO - Insert more theme states here.
};

export {
  bootstrap_theme_state,
  bootstrap_theme_light_state,
  bootstrap_theme_dark_state,
};

export default bootstrap_theme_state;