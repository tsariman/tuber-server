import { backgroundJson } from '.'

// Material-UI Theme
// TODO Modify to change the overall appearance of the page
/** Material-UI Theme */
const themeJson = {
  'components': {
    'MuiDrawer': {
      'styleOverrides': {
        'paper': {
          'backgroundColor': backgroundJson.color,
          'borderLeft': 'none',
          'borderRight': 'none'
        },
      },
    },
    'MuiAppBar': {
      'styleOverrides': {
        'colorPrimary': {
          'color': '#000000de',
          'backgroundColor': backgroundJson.color
        },
      },
    },
  },
  'palette': {
    'background': {
      'default': backgroundJson.color
    }
  },
  'typography': {
    'fontFamily': '\'Quicksand\', sans-serif'
  }
}

export default themeJson