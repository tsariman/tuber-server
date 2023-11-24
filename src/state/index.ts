import { TStateAppBar, TStateBackground } from '../common.types'

/** Directive used to remove states client-side. */
export const NET_STATE_PATCH_DELETE = '<#DEL>'

// Gray background for page
export const backgroundState: TStateBackground = {
  'color': 'transparent'// '#f0f0f0',
}

// Grey app bar with text-transform disabled
export const appBarState: TStateAppBar = {
  'props': {
    'elevation': 0,
    // 'color': 'transparent',
    // 'sx': {
    //   'backgroundColor': background.color
    // }
  },
  'menuItemsSx': {
    'textTransform': 'none'
  }
}
