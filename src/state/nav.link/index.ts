import IStateLink from '../../../../tuber-client/src/controllers/interfaces/IStateLink'

export const homeLinkJson: IStateLink = {
  'has': {
    'text': 'Home',
    'route': '/'
  }
}

/** Backup for the original "Login" link. */
export const defaultLoginLinkJson: IStateLink = {
  'has': {
    'text': 'Login',
    'route': 'login'
  }
}

export const loginLinkJson: IStateLink = {
  'type': 'icon',
  'has': {
    'icon': 'power_settings_new_outline',
    'handle': 'onclick : tuberCallbacks.loginDialog'
  }
}

export const getAuthenticationLinkJson = (username?: string): IStateLink => (
  username ? {
    'type': 'hybrid',
    'has': {
      'icon': 'power_settings_new_outline',
      'text': username,
    }
  }: {
    'type': 'icon',
    'has': {
      'icon': 'power_settings_new_outline',
      'route': 'login'
    }
  }
)

export const authenticatedLinkJson: IStateLink = {
  'type': 'hybrid',
  'has': {
    'icon': 'power_settings_new_outline',
    'text': '',
  }
}