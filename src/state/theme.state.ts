import { backgroundState } from '.'

// Material-UI Theme
// TODO Modify to change the overall appearance of the page
/** Material-UI Theme */
const themeState = {
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

export default themeState