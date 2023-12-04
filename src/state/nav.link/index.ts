import { TStateLink } from '../../common.types'

export const homeLinkState: TStateLink = {
  'has': {
    'text': 'Home',
    'route': '/'
  }
}

/** Backup for the original "Login" link. */
export const defaultLoginLinkState: TStateLink = {
  'has': {
    'text': 'Login',
    'route': 'login'
  }
}

export const loginLInkState: TStateLink = {
  'type': 'icon',
  'has': {
    'icon': 'power_settings_new_outline',
    'route': 'login'
  }
}

export const powerLinkState: TStateLink = {
  'type': 'icon',
  'has': {
    'icon': 'power_settings_new_outline',
    'onclickHandle': 'tuberCallbacks.$32_C_1',
    'iconProps': { 'sx': { 'color': 'grey.500' }}
  }
}

export const getAuthPowerLinkState = (username: string): TStateLink => ({
  'type': 'hybrid',
  'has': {
    'icon': 'power_settings_new_outline',
    'text': username,
    'iconProps': { 'sx': { 'color': 'green' }}
  }
})

export const authenticatedLinkState: TStateLink = {
  'type': 'hybrid',
  'has': {
    'icon': 'power_settings_new_outline',
    'text': '',
  }
}

// Config.register('state', '3', $3_STATE_KEY)
export const bookmarkAddFromUrlLinkState: TStateLink = {
  'type': 'icon',
  '_id': '3',
  'has': {
    'icon': 'playlist_add_outline',
    // Button to create a new bookmark from a video URL
    'onclickHandle': `tuberCallbacks.$3_C_1`,
    'iconProps': { 'sx': { 'color': 'grey.600' }},
  }
}

export const defaultErrorsViewLinkState: TStateLink = {
  'has': {
    'text': 'Client errors',
    'route': 'default-errors-view'
  }
}

export const darkModeLinkState: TStateLink = {
  'type': 'icon',
  'has': {
    'icon': 'light_mode_outline',
    'iconProps': {
      'sx': { 'color': '#fada5e' }
    },
    'onclickHandle': `tuberCallbacks.$44_C_1`,
  }
}

export const lightModeLinkState: TStateLink = {
  'type': 'icon',
  'has': {
    'icon': 'dark_mode_outline',
    'iconProps': {
      'sx': { 'color': '#5d89ba' }
    },
    'onclickHandle': `tuberCallbacks.$44_C_1`,
  }
}