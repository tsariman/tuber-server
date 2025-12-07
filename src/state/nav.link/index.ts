import {
  $48_STATE_KEY,
  $66_STATE_KEY,
  $67_STATE_KEY,
  $72_STATE_KEY,
  $74_STATE_KEY,
  $75_STATE_KEY,
  TStateLink
} from '@tuber/shared'
import { clone_with_descriptors, t } from '../../business.logic'
import { register } from '../../business.logic/registry'

export const homeLinkState: TStateLink = {
  'has': {
    get 'text'() { return t('home', 'Home') },
    'route': '/'
  }
}
/** Backup for the original "signin" link. */
export const defaultSignInLinkState: TStateLink = {
  'has': {
    get 'text'() { return t('signin', 'Sign in') },
    'route': 'sign-in'
  }
}
export const signInLInkState: TStateLink = {
  'type': 'icon',
  'has': {
    'icon': 'power_settings_new_outline',
    'route': 'sign-in'
  }
}

register('state', '67', $67_STATE_KEY)
/** Link state for logging in. @id 67 */
export const powerSignInLinkState: TStateLink = {
  '_id': '67',
  '_key': $67_STATE_KEY,
  'type': 'icon',
  'has': {
    'icon': 'power_settings_new_outline',
    'onclickHandler': 'tuberCallbacks.$32_C_1',
    'svgIconProps': { 'sx': { 'color': 'grey.500' }}
  }
}
/** Dark theme mode for link state to sign in. @id 67 */
export const $67DarkThemeMode: TStateLink = (() => {
  const base = clone_with_descriptors(powerSignInLinkState ?? {})
  const has = clone_with_descriptors(powerSignInLinkState.has ?? {})
  const svgIconProps = { 'sx': { 'color': 'grey.300' } }
  has.svgIconProps = svgIconProps
  base.has = has
  return base
})()

register('state', '66', $66_STATE_KEY)
/** Link state for signing out. @id 66 */
export const powerLogoutLinkState: TStateLink = {
  '_id': '66',
  '_key': $66_STATE_KEY,
  'type': 'icon',
  'has': {
    'icon': 'power_settings_new_outline',
    'onclickHandler': 'tuberCallbacks.$66_C_1',
    'svgIconProps': { 'sx': { 'color': 'info.light' }}
  }
}
/** Dark theme mode for link state to sign out. @id 66 */
export const $66DarkThemeMode: TStateLink = (() => {
  const base = clone_with_descriptors(powerLogoutLinkState)
  const has = clone_with_descriptors(powerLogoutLinkState.has ?? {})
  const svgIconProps = { 'sx': { 'color': 'info.dark' }}
  has.svgIconProps = svgIconProps
  base.has = has
  return base
})()
/** Get link state for signing out. @id 67 */
export const getAuthPowerLinkState = (username: string): TStateLink => {
  const base = clone_with_descriptors(powerLogoutLinkState)
  base.type = 'hybrid'
  const has = clone_with_descriptors(powerLogoutLinkState.has ?? {})
  has.svgIconProps = { 'sx': { 'color': 'info.dark' }}
  has.text = username
  // [TODO] This will be a dropdown menu so users can see their profile.
  return base
}
/** Get dark mode link state for signing out. @id 66 */
export const getAuthDarkModePowerLinkState = (
  username: string
): TStateLink => {
  const base = clone_with_descriptors($66DarkThemeMode)
  base.type = 'hybrid'
  const has = clone_with_descriptors($66DarkThemeMode.has ?? {})
  has.text = username
  // [TODO] This will be a dropdown menu so users can see their profile.
  return base
}
export const authenticatedLinkState: TStateLink = {
  'type': 'hybrid',
  'has': {
    'icon': 'power_settings_new_outline',
    'text': '',
  }
}
/** Link to create a new bookmark from a video URL. */
export const bookmarkAddFromUrlLinkState: TStateLink = {
  'type': 'icon',
  '_id': '3',
  'has': {
    'icon': 'playlist_add_outline',
    'onclickHandler': `tuberCallbacks.$3_C_1`,
    'svgIconProps': { 'sx': { 'color': 'grey.600' }},
  }
}
export const defaultErrorsViewLinkState: TStateLink = {
  'has': {
    get 'text'() { return t('clienterrors', 'Client errors') },
    'route': 'default-errors-view'
  }
}
export const researchAppErrorsViewLinkState: TStateLink = {
  'has': {
    get 'text'() { return t('clienterrors', 'Client errors') },
    'route': $48_STATE_KEY
  }
}
export const darkModeLinkState: TStateLink = {
  'type': 'icon',
  'has': {
    'icon': 'light_mode_outline',
    'svgIconProps': {
      'sx': { 'color': '#fada5e' }
    },
    'onclickHandler': `tuberCallbacks.$44_C_1`,
  }
}
export const lightModeLinkState: TStateLink = {
  'type': 'icon',
  'has': {
    'icon': 'dark_mode_outline',
    'svgIconProps': {
      'sx': { 'color': '#5d89ba' }
    },
    'onclickHandler': `tuberCallbacks.$44_C_1`,
  }
}
export const signupLinkState: TStateLink = {
  'has': {
    'text': 'Sign Up',
    'route': $72_STATE_KEY
  }
}
export const createUserLinkState: TStateLink = {
  'type': 'icon',
  'has': {
    'icon': 'user_new',
    'route': $74_STATE_KEY
  }
}
export const userLinkState: TStateLink = {
  'type': 'icon',
  'has': {
    'icon': 'user',
    'route': $75_STATE_KEY
  }
}