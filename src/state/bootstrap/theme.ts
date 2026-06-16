import { IStateContext, TBootstrapState } from '../_state.common.types'
import { PrepareState } from '../PrepareState'
import Config from '../../config'
import { ThemeOptions } from '@mui/material'

const LIGHT_COLORS = {
  bg: '#f5f7fc',
  surface: '#ffffff',
  surfaceAlt: '#f1f4fb',
  border: '#d9e1f2',
  text: '#1a2340',
  muted: '#5f6d8f',
  accent: '#4f62e6',
  accentHover: '#4353c7'
} as const

const DARK_COLORS = {
  bg: '#0f1117',
  surface: '#1a1d27',
  surfaceAlt: '#22263a',
  border: '#2d3148',
  text: '#e2e4ef',
  muted: '#7b80a0',
  accent: '#5c6ef5',
  accentHover: '#7080f8'
} as const

const buildComponentOverrides = (c: typeof LIGHT_COLORS | typeof DARK_COLORS) => ({
  'MuiPaper': {
    'styleOverrides': {
      'root': {
        'backgroundImage': 'none',
        'backgroundColor': c.surface,
        'border': `1px solid ${c.border}`,
        'borderRadius': 12
      }
    }
  },
  'MuiCard': {
    'styleOverrides': {
      'root': {
        'backgroundImage': 'none',
        'backgroundColor': c.surface,
        'border': `1px solid ${c.border}`,
        'borderRadius': 12
      }
    }
  },
  'MuiDrawer': {
    'styleOverrides': {
      'paper': {
        'backgroundColor': c.surface,
        'borderLeft': 'none',
        'borderRight': 'none',
        'borderColor': c.border
      },
    },
  },
  'MuiAppBar': {
    'defaultProps': { 'elevation': 0 },
    'styleOverrides': {
      'root': {
        'border': 'none',
        'boxShadow': 'none'
      },
      'colorPrimary': {
        'color': c.text,
        'backgroundColor': 'transparent',
        'borderRadius': 0,
        'border': 'none',
        'borderBottom': 'none'
      },
    },
  },
  'MuiDialog': {
    'styleOverrides': {
      'paper': {
        'backgroundImage': 'none',
        'backgroundColor': c.surface,
        'border': `1px solid ${c.border}`,
        'borderRadius': 12
      }
    }
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
        'fontSize': '0.95rem',
        'fontWeight': 600,
        'borderRadius': 8
      },
      'containedPrimary': {
        'backgroundColor': c.accent,
        '&:hover': {
          'backgroundColor': c.accentHover
        }
      }
    }
  },
  'MuiInputLabel': {
    'styleOverrides': {
      'root': {
        'fontSize': '0.72rem',
        'fontWeight': 700,
        'letterSpacing': '0.06em',
        'textTransform': 'uppercase',
        'color': c.muted
      },
      'standard': {
        'fontSize': '0.82rem',
        '&.MuiInputLabel-shrink': {
          // Keep standard labels readable when they float above the input value.
          'fontSize': '0.82rem',
          'transform': 'translate(0, -1.5px) scale(0.9)'
        }
      },
      'filled': {
        // Keep resting filled labels vertically aligned with compact label typography.
        'transform': 'translate(12px, 20px) scale(1)',
        '&.MuiInputLabel-shrink': {
          'transform': 'translate(12px, 7px) scale(0.75)'
        }
      },
      'outlined': {
        'fontSize': '0.82rem',
        '&.MuiInputLabel-shrink': {
          'fontSize': '0.82rem',
          'backgroundColor': c.surfaceAlt,
          'padding': '0 4px',
          'borderRadius': 4,
          'transform': 'translate(14px, -8px) scale(0.9)'
        }
      }
    }
  },
  'MuiFilledInput': {
    'styleOverrides': {
      'root': {
        'borderRadius': 8,
        'backgroundColor': c.surfaceAlt,
        '&:before': {
          'borderBottomColor': c.border
        },
        '&:hover:not(.Mui-disabled, .Mui-error):before': {
          'borderBottomColor': c.accent
        },
        '&.Mui-focused:after': {
          'borderBottomColor': c.accent
        }
      },
      'input': {
        'paddingTop': 24,
        'paddingBottom': 10
      }
    }
  },
  'MuiOutlinedInput': {
    'styleOverrides': {
      'root': {
        'borderRadius': 8, // Consistent border radius with other components
        'backgroundColor': c.surfaceAlt,
        '& .MuiOutlinedInput-notchedOutline': {
          'borderColor': c.border
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          'borderColor': c.accent
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          'borderColor': c.accent,
          'borderWidth': 2 // Increase border width on focus for better visibility
        },
        '&.Mui-error .MuiOutlinedInput-notchedOutline': {
          'borderColor': '#ef4444'
        }
      },
      'input': {
        'paddingTop': 12,
        'paddingBottom': 12
      }
    }
  },
  'MuiFormHelperText': {
    'styleOverrides': {
      'root': {
        'fontSize': '0.75rem'
      }
    }
  },
  'MuiListItemButton': {
    'styleOverrides': {
      'root': {
        'borderRadius': 8,
        '&.Mui-selected': {
          'backgroundColor': 'rgba(92,110,245,0.16)'
        },
        '&.Mui-selected:hover': {
          'backgroundColor': 'rgba(92,110,245,0.24)'
        }
      }
    }
  }
})

const bootstrap_theme_light_state: TBootstrapState<ThemeOptions> = {

  DEFAULT: {
    'shape': {
      'borderRadius': 8
    },
    'components': buildComponentOverrides(LIGHT_COLORS),
    'palette': {
      'background': {
        'default': LIGHT_COLORS.bg,
        'paper': LIGHT_COLORS.surface
      },
      'primary': {
        'main': LIGHT_COLORS.accent
      },
      'text': {
        'primary': LIGHT_COLORS.text,
        'secondary': LIGHT_COLORS.muted
      },
      'divider': LIGHT_COLORS.border,
      'action': {
        'hover': LIGHT_COLORS.surfaceAlt
      },
      'secondary': {
        'main': '#ef6c00'
      },
    },
    'typography': {
      'fontFamily': '\'IBM Plex Sans\', \'Segoe UI\', sans-serif'
    }
  }

  // TODO - Insert more (light) theme states here.
}

const bootstrap_theme_dark_state: TBootstrapState<ThemeOptions> = {

  DEFAULT: {
    'shape': {
      'borderRadius': 8
    },
    'components': buildComponentOverrides(DARK_COLORS),
    'palette': {
      'mode': 'dark',
      'background': {
        'default': DARK_COLORS.bg,
        'paper': DARK_COLORS.surface
      },
      'primary': {
        'main': DARK_COLORS.accent
      },
      'text': {
        'primary': DARK_COLORS.text,
        'secondary': DARK_COLORS.muted
      },
      'divider': DARK_COLORS.border,
      'action': {
        'hover': DARK_COLORS.surfaceAlt
      },
      'secondary': {
        'main': '#ef6c00'
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
      'fontFamily': '\'IBM Plex Sans\', \'Segoe UI\', sans-serif'
    }
  }

  // TODO - Insert more (dark) theme states here.
}

const bootstrap_theme_state: TBootstrapState<ThemeOptions> = {

  DEFAULT: (context: IStateContext): ThemeOptions => {
    const themeMode = context.theme || Config.DEFAULT_THEME_MODE

    switch (themeMode) {
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