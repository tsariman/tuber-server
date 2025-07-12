import Config from 'src/config'
import {
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  THEME_LIGHT_APP_BAR_COLOR,
  THEME_MODE
} from '../constants'
import { TThemeMode, TThemeOptions } from 'src/common.types'

// TODO Modify to change the overall appearance of the page

/** Get material-ui theme object. @deprecated */
export default function get_theme_state (userMode?: string): TThemeOptions {
  const mode = userMode ?? Config.read<TThemeMode>(THEME_MODE, Config.DEFAULT_THEME_MODE)
  return mode === 'dark' ? darkThemeState : lightThemeState
}

/** @deprecated */
export const darkThemeState: TThemeOptions = {
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

/**
 * TODO Default light theme backup. To revert to the unmodified light theme,
 * copy the contents of this object into the themeState object.
 *
 * @deprecated
 */
export const lightThemeState: TThemeOptions = {
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