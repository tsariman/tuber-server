import IStateLink from '../../../../tuber-client/src/controllers/interfaces/IStateLink'

export const homeLinkState: IStateLink = {
  'has': {
    'text': 'Home',
    'route': '/'
  }
}

/** Backup for the original "Login" link. */
export const defaultLoginLinkState: IStateLink = {
  'has': {
    'text': 'Login',
    'route': 'login'
  }
}

export const loginLInkState: IStateLink = {
  'type': 'icon',
  'has': {
    'icon': 'power_settings_new_outline',
    'route': 'login'
  }
}

export const powerLinkState: IStateLink = {
  'type': 'icon',
  'has': {
    'icon': 'power_settings_new_outline',
    'onclickHandle': 'tuberCallbacks.loginDialog',
    'iconProps': { 'sx': { 'color': 'grey.500' }}
  }
}

export const getAuthPowerLinkState = (username: string): IStateLink => ({
  'type': 'hybrid',
  'has': {
    'icon': 'power_settings_new_outline',
    'text': username,
    'iconProps': { 'sx': { 'color': 'green' }}
  }
})

export const authenticatedLinkState: IStateLink = {
  'type': 'hybrid',
  'has': {
    'icon': 'power_settings_new_outline',
    'text': '',
  }
}

const _3 = '3'
export const annotationAddFromUrlLinkState: IStateLink = {
  'type': 'icon',
  '_id': _3,
  'has': {
    'icon': 'playlist_add_outline',
    // Button to create a new annotation from a video URL
    'onclickHandle': `tuberCallbacks._3_C_1`,
    'iconProps': { 'sx': { 'color': 'grey.600' }},
  }
}

export const defaultErrorsViewLinkState: IStateLink = {
  'has': {
    'text': 'Client errors',
    'route': 'default-errors-view'
  }
}