export const CONF_THEME_MODE = 'theme_mode'
export const DEFAULT_500_ERROR_MESSAGE = 'Failed.\nInternal Server Error.'
export const INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN'
export const MISSING_ACCESS_TOKEN = 'MISSING_ACCESS_TOKEN'
export const DEFAULT_AUTH_HEADER = `Bearer ${MISSING_ACCESS_TOKEN}`
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
/**
 * Array of regular expressions to extract the thumbnail HTML from a web page
 * html source.
 */
export const CONF_THUMB_URL_REGEXP = [
  /"thumbnailUrl".+?"(.+?)"/,
  /poster.+?"(.+?)"/,
  /og:image.+?"(.+?)"/,
  // TODO - Add more
]

export const $1_KEY = 'newVideoUrlForm'
export const $2_KEY = 'newVideoUrlDialog'
export const $3_KEY = 'newBookmarkFromUrlLinkState'
export const $4_KEY = 'newYouTubeBookmarkForm'
export const $5_KEY = 'editYouTubeBookmarkForm'
export const $6_KEY = 'newYouTubeBookmarkDialog'
export const $7_KEY = 'editYouTubeBookmarkDialog'
export const $8_KEY = 'newRumbleBookmarkDialog'
export const $9_KEY = 'newRumbleBookmarkForm'
export const $10_KEY = 'editRumbleBookmarkForm'
export const $11_KEY = 'editRumbleBookmarkDialog'
export const $12_KEY = 'newVimeoBookmarkForm'
export const $13_KEY = 'editVimeoBookmarkForm'
export const $14_KEY = 'newVimeoBookmarkDialog'
export const $15_KEY = 'editVimeoBookmarkDialog'
export const $16_KEY = 'newOdyseeBookmarkDialog'
export const $17_KEY = 'newOdyseeBookmarkForm'
export const $18_KEY = 'editOdyseeBookmarkForm'
export const $19_KEY = 'newDailyBookmarkForm'
export const $20_KEY = 'editDailyBookmarkForm'
export const $21_KEY = 'newDailyBookmarkDialog'
export const $22_KEY = 'editDailyBookmarkDialog'
export const $23_KEY = 'editOdyseeBookmarkDialog'
export const $24_KEY = 'newFacebookBookmarkForm'
export const $25_KEY = 'editFacebookBookmarkForm'
export const $26_KEY = 'newFacebookBookmarkDialog'
export const $27_KEY = 'editFacebookBookmarkDialog'
export const $28_KEY = 'newUnknownBookmarkForm'
export const $29_KEY = 'editUnknownBookmarkForm'
export const $30_KEY = 'newUnknownBookmarkDialog'
export const $31_KEY = 'editUnknownBookmarkDialog'
export const $32_KEY = 'loginDialog'
export const $33_KEY = 'registerDialog'
export const $34_KEY = 'deleteBookmarkDialog'
export const $35_KEY = 'clientAlertDialog'
export const $36_KEY = 'newTwitchBookmarkDialog'
export const $37_KEY = 'editTwitchBookmarkDialog'
export const $38_KEY = 'newTwitchBookmarkForm'
export const $39_KEY = 'editTwitchBookmarkForm'
export const $40_KEY = 'research-app'
export const $41_KEY = 'loginForm'
export const $42_KEY = 'login'
export const $43_KEY = 'signed-In'
export const $44_KEY = 'dev-install'
export const $45_KEY = 'devTestThumbnailForm'
export const $46_KEY = 'dev-test-thumbnail'
export const $47_KEY = 'devInstallForm'
export const $48_KEY = 'set-authorization-key'
export const $49_KEY = 'devSetAuthorizationKeyForm'
export const $50_KEY = 'devSetAuthorizationUrlForm'
export const $51_KEY = 'set-authorization-url'
export const $52_KEY = '<taken>'
export const $53_KEY = 'admin-readable'
export const $54_KEY = 'devTestRumbleRegexpForm'
export const $55_KEY = 'admin-config-app'
export const $56_KEY = 'dev-test-rumble-regexp'
export const $57_KEY = 'devTestUnknownRegexpForm'
export const $58_KEY = 'dev-test-unknown-regexp'
export const $59_KEY = 'dev-twitch-input-client-id'
export const $60_KEY = 'devTwitchInputClientIdForm'
export const $61_KEY = 'dev-save-config-value'
export const $62_KEY = 'devSaveConfigValueForm'