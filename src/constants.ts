// ENDPOINTS ------------------------------------------------------------------

export const EP_AUTHENTICATE = 'authenticate'
export const EP_SIGNOUT = 'signout'
export const EP_BOOKMARKS = 'bookmarks'
export const EP_USERS = 'users'
export const EP_STATE = 'state'
export const EP_DEV = 'dev'
export const EP_INSTALL = 'install'
export const EP_PLATFORM = 'platform'
export const EP_REGISTER = 'register'

// THEMING (theme prefix) -----------------------------------------------------

export const THEME_MODE = 'theme_mode'
export const THEME_LIGHT_PAPER_COLOR = '#dddddd'
export const THEME_DARK_PAPER_COLOR = '#424242'
export const THEME_LIGHT_BACKGROUND_COLOR = '#f0f0f0'
export const THEME_DARK_DIALOG_BACKGROUND_COLOR = '#141a1f'
export const THEME_LIGHT_APP_BAR_ICON_COLOR = 'grey.500'
export const THEME_DARK_APP_BAR_ICON_COLOR = 'grey.200'
export const THEME_LIGHT_APP_BAR_COLOR = '#000000de'
export const THEME_DARK_APP_BAR_COLOR = '#000000de' // [TODO]: Change this

// MESSAGES (msg prefix) ------------------------------------------------------

export const MSG_500_ERROR_MESSAGE = 'Failed.\nInternal Server Error.'
export const MSG_INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN'

// FORMS (form fields prefix) -------------------------------------------------

export const START_SECONDS_REQUIRED_MESSAGE = 'Starting time is required'
export const URL_REQUIRED_MESSAGE = 'Link is required'
/** Bookmark required title message */
export const TITLE_REQUIRED_MESSAGE = `Don't forget your title`
/** Bookmark title field maximum length. */
export const TITLE_MAX_LENGTH = 80
/** Bookmark title max length error message */
export const TITLE_MAX_LENGTH_MESSAGE = `Title is too long. (${TITLE_MAX_LENGTH} characters max)`
/** Bookmark note field (textarea) number of rows. */
export const NOTE_FIELD_ROWS = 6
/** Bookmark note max length */
export const NOTE_MAX_LENGTH = 500
export const NOTE_MAX_LENGTH_MESSAGE = `Note is too long. (${NOTE_MAX_LENGTH} characters max)`
export const EMBED_URL_MESSAGE = 'Paste-in the embed URL or iframe HTML code'

// DEFAULT VALUES -------------------------------------------------------------

/** Database mongoose-paginate-v2 query */
export const DB_PAGINATION_QUERY = {
  is_active: true // Only return active documents
                  // When a document is deleted, is_active is set to false
}
/** Database mongoose-paginate-v2 options */
export const DB_PAGINATION_OPTIONS = {
  // sort: { created_at: -1 } // TODO Comment this out when debugging pagination
  select: { // Exclude these fields from the query
    __v: 0,
    is_active: 0,
    restrictions: 0,
    rules: 0
  }
}
/**
 * Array of regular expressions to extract the thumbnail HTML from a web page
 * html source.
 */
export const THUMBNAIL_URLS_REGEXP = [
  /"thumbnailUrl".+?"(.+?)"/,
  /poster.+?"(.+?)"/,
  /og:image.+?"(.+?)"/,
  // TODO - Add more
]

// CONFIGURATION KEYS (conf prefix) -------------------------------------------

/** Configuration property at which the Twitch client ID can be acquired. */
export const CONF_TWITCH_CLIENT_ID = `twitch_client_id`
/** Configuration property as which the Twitch client secret can be acquired. */
export const CONF_TWITCH_CLIENT_SECRET = `twitch_client_secret`
/** Configuration property at which the Twitch access token can be acquired. */
export const CONF_TWITCH_ACCESS_TOKEN = `twitch_access_token`
/** Configuration property at which the Twitch refresh token can be acquired. */
export const CONF_TWITCH_REFRESH_TOKEN = `twitch_refresh_token`
/**
 * Configuration property at which the Twitch access token expiration can be
 * acquired.
 */
export const CONF_TWITCH_TOKEN_EXPIRATION = `twitch_expiration_date`
/**
 * In case the twitch token renewal process failed. This key will be set to
 * `true` in the Config object to prevent the token renewal process from
 * running again.
 */
export const CONF_TWITCH_DISABLE_TOKEN_RENEWAL = `twitch_disable_token_renewal`
/**
 * In case the twitch token renewal process failed. This key will be set
 * to `true` in the Config object to prevent the thumbnail retrieval process
 * from running.
 */
export const CONF_TWITCH_DISABLE_THUMBNAIL_RETRIEVAL = `twitch_disable_thumbnail_retrieval`

// MISCELLANEOUS --------------------------------------------------------------

export const MISSING_ACCESS_TOKEN = 'MISSING_ACCESS_TOKEN'
export const DEFAULT_AUTH_HEADER = `Bearer ${MISSING_ACCESS_TOKEN}`

// STATE KEYS -----------------------------------------------------------------

export const $1_STATE_KEY = 'newVideoUrlForm'
export const $2_STATE_KEY = 'newVideoUrlDialog'
export const $3_STATE_KEY = 'newBookmarkFromUrlLinkState'
export const $4_STATE_KEY = 'newYouTubeBookmarkForm'
export const $5_STATE_KEY = 'editYouTubeBookmarkForm'
export const $6_STATE_KEY = 'newYouTubeBookmarkDialog'
export const $7_STATE_KEY = 'editYouTubeBookmarkDialog'
export const $8_STATE_KEY = 'newRumbleBookmarkDialog'
export const $9_STATE_KEY = 'newRumbleBookmarkForm'
export const $10_STATE_KEY = 'editRumbleBookmarkForm'
export const $11_STATE_KEY = 'editRumbleBookmarkDialog'
export const $12_STATE_KEY = 'newVimeoBookmarkForm'
export const $13_STATE_KEY = 'editVimeoBookmarkForm'
export const $14_STATE_KEY = 'newVimeoBookmarkDialog'
export const $15_STATE_KEY = 'editVimeoBookmarkDialog'
export const $16_STATE_KEY = 'newOdyseeBookmarkDialog'
export const $17_STATE_KEY = 'newOdyseeBookmarkForm'
export const $18_STATE_KEY = 'editOdyseeBookmarkForm'
export const $19_STATE_KEY = 'newDailyBookmarkForm'
export const $20_STATE_KEY = 'editDailyBookmarkForm'
export const $21_STATE_KEY = 'newDailyBookmarkDialog'
export const $22_STATE_KEY = 'editDailyBookmarkDialog'
export const $23_STATE_KEY = 'editOdyseeBookmarkDialog'
export const $24_STATE_KEY = 'newFacebookBookmarkForm'
export const $25_STATE_KEY = 'editFacebookBookmarkForm'
export const $26_STATE_KEY = 'newFacebookBookmarkDialog'
export const $27_STATE_KEY = 'editFacebookBookmarkDialog'
export const $28_STATE_KEY = 'newUnknownBookmarkForm'
export const $29_STATE_KEY = 'editUnknownBookmarkForm'
export const $30_STATE_KEY = 'newUnknownBookmarkDialog'
export const $31_STATE_KEY = 'editUnknownBookmarkDialog'
export const $32_STATE_KEY = 'signInDialog'
export const $33_STATE_KEY = 'registerDialog'
export const $34_STATE_KEY = 'deleteBookmarkDialog'
export const $35_STATE_KEY = 'clientAlertDialog'
export const $36_STATE_KEY = 'newTwitchBookmarkDialog'
export const $37_STATE_KEY = 'editTwitchBookmarkDialog'
export const $38_STATE_KEY = 'newTwitchBookmarkForm'
export const $39_STATE_KEY = 'editTwitchBookmarkForm'
export const $40_STATE_KEY = 'research-app'
export const $41_STATE_KEY = 'signInForm'
export const $42_STATE_KEY = 'sign-in'
export const $43_STATE_KEY = 'dev-signed-In'
export const $44_STATE_KEY = 'dev-install'
export const $45_STATE_KEY = 'devTestThumbnailForm'
export const $46_STATE_KEY = 'dev-test-thumbnail'
export const $47_STATE_KEY = 'devInstallForm'
export const $48_STATE_KEY = 'research-app-errors-view'
export const $49_STATE_KEY = 'devSetAuthorizationKeyForm'
export const $50_STATE_KEY = 'devSetAuthorizationUrlForm'
export const $51_STATE_KEY = '<available>' // TODO: Not used
export const $52_STATE_KEY = '<taken>'
export const $53_STATE_KEY = 'admin-readable'
export const $54_STATE_KEY = 'devTestRumbleRegexpForm'
export const $55_STATE_KEY = 'admin-config-app'
export const $56_STATE_KEY = 'dev-test-rumble-regexp'
export const $57_STATE_KEY = 'devTestUnknownRegexpForm'
export const $58_STATE_KEY = 'dev-test-unknown-regexp'
export const $59_STATE_KEY = 'dev-twitch-input-client-id'
export const $60_STATE_KEY = 'devTwitchInputClientIdForm'
export const $61_STATE_KEY = 'dev-save-config-value'
export const $62_STATE_KEY = 'devSaveConfigValueForm'
export const $63_STATE_KEY = 'researchPageAppBar'
export const $64_STATE_KEY = 'responseAlertDialog'
export const $65_STATE_KEY = 'alertDialog'
export const $66_STATE_KEY = 'powerLogoutLink'
export const $67_STATE_KEY = 'powerSignInLink'
export const $68_STATE_KEY = 'confirmLogoutDialog'
export const $69_STATE_KEY = 'registerForm'