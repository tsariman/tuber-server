import { background } from '.'

// Material-UI Theme
// TODO Modify to change the overall appearance of the page
/** Material-UI Theme */
const theme = {
  'components': {
    'MuiDrawer': {
      'styleOverrides': {
        'paper': {
          'backgroundColor': background.color,
          'borderLeft': 'none',
          'borderRight': 'none'
        },
      },
    },
    'MuiAppBar': {
      'styleOverrides': {
        'colorPrimary': {
          'color': '#000000de',
          'backgroundColor': background.color
        },
      },
    },
  },
  'palette': {
    'background': {
      'default': background.color
    }
  },
  'typography': {
    'fontFamily': '\'Quicksand\', sans-serif'
  }
}

export default theme