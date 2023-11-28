import {
  THEME_LIGHT_BACKGROUND_COLOR,
  THEME_DARK_DIALOG_BACKGROUND_COLOR,
  THEME_MODE,
  THEME_LIGHT_APP_BAR_COLOR
} from '../constants'
import Config from '../config'
import { TThemeMode } from '../common.types'

// TODO Modify to change the overall appearance of the page

/** Get material-ui theme object */
export default function get_theme_state () {
  const mode = Config.read<TThemeMode>(THEME_MODE, Config.DEFAULT_THEME_MODE)
  return mode === 'dark' ? darkThemeState : lightThemeState
}

export const darkThemeState = {
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
      '50': '#212121', // #fafafa // 900
      '100': '#424242', // #f5f5f5 // 800
      '200': '#616161', // #eeeeee // 700
      '300': '#757575', // #e0e0e0 // 600
      '400': '#9e9e9e', // #bdbdbd // 500
      '500': '#bdbdbd', // #9e9e9e // 400
      '600': '#e0e0e0', // #757575 // 300
      '700': '#eeeeee', // #616161 // 200
      '800': '#f5f5f5', // #424242 // 100
      '900': '#fafafa', // #212121 // 50
      'A100': '#d5d5d5', // #d5d5d5
      'A200': '#aaaaaa', // #aaaaaa
      'A400': '#303030', // #303030
      'A700': '#616161' // #616161
    }
  },
  'typography': {
    'fontFamily': '\'Quicksand\', sans-serif'
  }
}

/**
 * TODO Default light theme backup. To revert to the unmodified light theme,
 * copy the contents of this object into the themeState object.
 */
export const lightThemeState = {
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