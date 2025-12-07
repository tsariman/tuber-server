import { TThemeMode } from '../../common.types'
import { IStateContext, TBootstrapState } from '../_state.common.types'
import { PrepareState } from '../PrepareState'
import { THEME_MODE } from '@tuber/shared'
import Config from '../../config'
import { ThemeOptions } from '@mui/material'

const bootstrap_theme_light_state: TBootstrapState<ThemeOptions> = {

  DEFAULT: {
    'components': {
      'MuiDrawer': {
        'styleOverrides': {
          'paper': {
            'backgroundColor': '#f0f0f0',
            'borderLeft': 'none',
            'borderRight': 'none'
          },
        },
      },
      'MuiAppBar': {
        'defaultProps': { 'elevation': 0 },
        'styleOverrides': {
          'colorPrimary': {
            'color': '#4c4c4c',
            'backgroundColor': '#f0f0f0'
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
        'default': '#f0f0f0'
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
            'backgroundColor': '#141a1f',
            'borderLeft': 'none',
            'borderRight': 'none'
          },
        },
      },
      'MuiAppBar': {
        'defaultProps': { 'elevation': 0 },
        'styleOverrides': {
          'colorPrimary': {
            'color': 'inherit',
            'backgroundColor': '#141a1f'
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
        'default': '#141a1f'
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
    const mode = context.theme ?? Config.read<TThemeMode>(
      THEME_MODE,
      Config.DEFAULT_THEME_MODE
    )

    switch (mode) {
      case 'dark':
        return new PrepareState<ThemeOptions>(
          context
        ).process(bootstrap_theme_dark_state).get()
      default:
      case 'light':
        return new PrepareState<ThemeOptions>(
          context
        ).process(bootstrap_theme_light_state).get()
    }
  }

  // TODO - Insert more theme states here.
}

export {
  bootstrap_theme_state,
  bootstrap_theme_light_state,
  bootstrap_theme_dark_state,
}

export default bootstrap_theme_state