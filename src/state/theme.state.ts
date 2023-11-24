import { backgroundState } from '.'

// Currently, I am transitioning the themeState to dark mode. And when that is
// over, I will rename the 'themeState' to 'darkThemeState' and 
// 'lightThemeState', the backup of original themeState, I will rename it back
// to 'themeState'.

// TODO Modify to change the overall appearance of the page
/** Material-UI Theme */
const themeState = {
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
      'styleOverrides': {
        'colorPrimary': {
          // 'color': '#000000de',
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
    }
  },
  'typography': {
    'fontFamily': '\'Quicksand\', sans-serif'
  }
}

export default themeState

export const darkThemeState = {
  'components': {
    'MuiDrawer': {
      'styleOverrides': {
        'paper': {
          'backgroundColor': backgroundState.color,
          'borderLeft': 'none',
          'borderRight': 'none'
        },
      },
    },
    'MuiAppBar': {
      'styleOverrides': {
        'colorPrimary': {
          'color': '#000000de',
          'backgroundColor': backgroundState.color
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
          'backgroundColor': backgroundState.color,
          'borderLeft': 'none',
          'borderRight': 'none'
        },
      },
    },
    'MuiAppBar': {
      'styleOverrides': {
        'colorPrimary': {
          'color': '#000000de',
          'backgroundColor': backgroundState.color
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
      'default': backgroundState.color
    }
  },
  'typography': {
    'fontFamily': '\'Quicksand\', sans-serif'
  }
}