// DATABASE -------------------------------------------------------------------

export const COLLECTION_NAME = 'bookmarks';

// ENDPOINTS ------------------------------------------------------------------

export const EP_AUTHENTICATE = 'authenticate';
export const EP_SIGNOUT = 'signout';
export const EP_BOOKMARKS = 'bookmarks';
export const EP_BOOKMARKS_ID = 'bookmarks/:id';
export const EP_USERS = 'users';
export const EP_STATE = 'state';
export const EP_DEV = 'dev';
export const EP_DEV_BUILDER = `dev/builder`;
export const EP_INSTALL = 'install';
export const EP_PLATFORM = 'platform';
export const EP_REGISTER = 'register';

// THEMING (theme prefix) -----------------------------------------------------

export const THEME_MODE = 'theme_mode';
export const THEME_LIGHT_PAPER_COLOR = '#dddddd';
export const THEME_DARK_PAPER_COLOR = '#424242';
export const THEME_LIGHT_BACKGROUND_COLOR = '#f0f0f0';
export const THEME_DARK_DIALOG_BACKGROUND_COLOR = '#141a1f';
export const THEME_LIGHT_APP_BAR_ICON_COLOR = 'grey.500';
export const THEME_DARK_APP_BAR_ICON_COLOR = 'grey.200';
export const THEME_LIGHT_APP_BAR_COLOR = '#000000de';
export const THEME_DARK_APP_BAR_COLOR = '#000000de'; // [TODO]: Change this

// MESSAGES (msg prefix) ------------------------------------------------------

export const LOG_INFO = '[INFO]';
export const LOG_DEBUG = '[DEBUG]';
export const MSG_500_ERROR_MESSAGE = 'Failed.\nInternal Server Error.';
export const MSG_INVALID_ACCESS_TOKEN = 'INVALID_ACCESS_TOKEN';

// FORMS (form fields prefix) -------------------------------------------------

export const START_SECONDS_REQUIRED_MESSAGE = 'Starting time is required';
export const URL_REQUIRED_MESSAGE = 'Link is required';
/** Bookmark required title message */
export const TITLE_REQUIRED_MESSAGE = `Don't forget your title`;
/** Bookmark title field maximum length. */
export const TITLE_MAX_LENGTH = 80;
/** Bookmark title max length error message */
export const TITLE_MAX_LENGTH_MESSAGE = `Title is too long. (${TITLE_MAX_LENGTH} characters max)`;
/** Bookmark note field (textarea) number of rows. */
export const NOTE_FIELD_ROWS = 6;
/** Bookmark note max length */
export const NOTE_MAX_LENGTH = 500;
export const NOTE_MAX_LENGTH_MESSAGE = `Note is too long. (${NOTE_MAX_LENGTH} characters max)`;
export const EMBED_URL_MESSAGE = 'Paste-in the embed URL or iframe HTML code';
export const EMBED_URL_REQUIRED_MESSAGE = 'We\'re going to need that Embed IFRAME URL. It\'s available the on video page.';
export const PUBLISHED_HELPER_TEXT = 'If published, anyone can see the bookmark.';

// DEFAULT VALUES -------------------------------------------------------------

/** Database mongoose-paginate-v2 query */
export const DB_PAGINATION_QUERY = {
  is_active: true // Only return active documents
                  // When a document is deleted, is_active is set to false
};
/** Database mongoose-paginate-v2 options */
export const DB_PAGINATION_OPTIONS: Record<string, unknown> = {
  // sort: { created_at: -1 } // TODO Comment this out when debugging pagination
  select: { // Exclude these fields from the query
    __v: 0,
    is_active: 0,
    restrictions: 0,
    rules: 0,
  } as Record<string, 1|0> // 1 = include, 0 = exclude
};
/**
 * Array of regular expressions to extract the thumbnail HTML from a web page
 * html source.
 */
export const THUMBNAIL_URLS_REGEXP = [
  /"thumbnailUrl".+?"(.+?)"/,
  /poster.+?"(.+?)"/,
  /og:image.+?"(.+?)"/,
  // TODO - Add more
];

// CONFIGURATION KEYS (conf prefix) -------------------------------------------

/** Configuration property at which the Twitch client ID can be acquired. */
export const CONF_TWITCH_CLIENT_ID = `twitch_client_id`;
/** Configuration property as which the Twitch client secret can be acquired. */
export const CONF_TWITCH_CLIENT_SECRET = `twitch_client_secret`;
/** Configuration property at which the Twitch access token can be acquired. */
export const CONF_TWITCH_ACCESS_TOKEN = `twitch_access_token`;
/** Configuration property at which the Twitch refresh token can be acquired. */
export const CONF_TWITCH_REFRESH_TOKEN = `twitch_refresh_token`;
/**
 * Configuration property at which the Twitch access token expiration can be
 * acquired.
 */
export const CONF_TWITCH_TOKEN_EXPIRATION = `twitch_expiration_date`;
/**
 * In case the twitch token renewal process failed. This key will be set to
 * `true` in the Config object to prevent the token renewal process from
 * running again.
 */
export const CONF_TWITCH_DISABLE_TOKEN_RENEWAL = `twitch_disable_token_renewal`;
/**
 * In case the twitch token renewal process failed. This key will be set
 * to `true` in the Config object to prevent the thumbnail retrieval process
 * from running.
 */
export const CONF_TWITCH_DISABLE_THUMBNAIL_RETRIEVAL = `twitch_disable_thumbnail_retrieval`;

// MISCELLANEOUS --------------------------------------------------------------

export const MISSING_ACCESS_TOKEN = 'MISSING_ACCESS_TOKEN';
export const DEFAULT_AUTH_HEADER = `Bearer ${MISSING_ACCESS_TOKEN}`;

// STATE KEYS -----------------------------------------------------------------

/** Page state for listing page app. @id 1 */
export const $1_STATE_KEY = 'newVideoUrlForm';
/** New video URL dialog state. @id 2 */
export const $2_STATE_KEY = 'newVideoUrlDialog';
/** New bookmark from URL link state. @id 3 */
export const $3_STATE_KEY = 'newBookmarkFromUrlLinkState';
/** New YouTube bookmark form state. @id 4 */
export const $4_STATE_KEY = 'newYouTubeBookmarkForm';
/** Edit YouTube bookmark form state. @id 5 */
export const $5_STATE_KEY = 'editYouTubeBookmarkForm';
/** New YouTube bookmark dialog state. @id 6 */
export const $6_STATE_KEY = 'newYouTubeBookmarkDialog';
/** Edit YouTube bookmark dialog state. @id 7 */
export const $7_STATE_KEY = 'editYouTubeBookmarkDialog';
/** New Rumble bookmark dialog state. @id 8 */
export const $8_STATE_KEY = 'newRumbleBookmarkDialog';
/** New Rumble bookmark form state. @id 9 */
export const $9_STATE_KEY = 'newRumbleBookmarkForm';
/** Edit Rumble bookmark form state. @id 10 */
export const $10_STATE_KEY = 'editRumbleBookmarkForm';
/** Edit Rumble bookmark dialog state. @id 11 */
export const $11_STATE_KEY = 'editRumbleBookmarkDialog';
/** New Vimeo bookmark form state. @id 12 */
export const $12_STATE_KEY = 'newVimeoBookmarkForm';
/** Edit Vimeo bookmark form state. @id 13 */
export const $13_STATE_KEY = 'editVimeoBookmarkForm';
/** New Vimeo bookmark dialog state. @id 14 */
export const $14_STATE_KEY = 'newVimeoBookmarkDialog';
/** Edit Vimeo bookmark dialog state. @id 15 */
export const $15_STATE_KEY = 'editVimeoBookmarkDialog';
/** New Odysee bookmark dialog state. @id 16 */
export const $16_STATE_KEY = 'newOdyseeBookmarkDialog';
/** New Odysee bookmark form state. @id 17 */
export const $17_STATE_KEY = 'newOdyseeBookmarkForm';
/** Edit Odysee bookmark form state. @id 18 */
export const $18_STATE_KEY = 'editOdyseeBookmarkForm';
/** New DailyMotion bookmark form state. @id 19 */
export const $19_STATE_KEY = 'newDailyBookmarkForm';
/** Edit DailyMotion bookmark form state. @id 20 */
export const $20_STATE_KEY = 'editDailyBookmarkForm';
/** New DailyMotion bookmark dialog state. @id 21 */
export const $21_STATE_KEY = 'newDailyBookmarkDialog';
/** Edit DailyMotion bookmark dialog state. @id 22 */
export const $22_STATE_KEY = 'editDailyBookmarkDialog';
/** Edit Odysee bookmark dialog state. @id 23 */
export const $23_STATE_KEY = 'editOdyseeBookmarkDialog';
/** New Facebook bookmark form state. @id 24 */
export const $24_STATE_KEY = 'newFacebookBookmarkForm';
/** Edit Facebook bookmark form state. @id 25 */
export const $25_STATE_KEY = 'editFacebookBookmarkForm';
/** New Facebook bookmark dialog state. @id 26 */
export const $26_STATE_KEY = 'newFacebookBookmarkDialog';
/** Edit Facebook bookmark dialog state. @id 27 */
export const $27_STATE_KEY = 'editFacebookBookmarkDialog';
/** New unknown bookmark form state. @id 28 */
export const $28_STATE_KEY = 'newUnknownBookmarkForm';
/** Edit unknown bookmark form state. @id 29 */
export const $29_STATE_KEY = 'editUnknownBookmarkForm';
/** New unknown bookmark dialog state. @id 30 */
export const $30_STATE_KEY = 'newUnknownBookmarkDialog';
/** Edit unknown bookmark dialog state. @id 31 */
export const $31_STATE_KEY = 'editUnknownBookmarkDialog';
/** Sign-in dialog state. @id 32 */
export const $32_STATE_KEY = 'signInDialog';
/** Register dialog state. @id 33 */
export const $33_STATE_KEY = 'registerDialog';
/** Delete bookmark dialog state. @id 34 */
export const $34_STATE_KEY = 'deleteBookmarkDialog';
/** Client alert dialog state. @id 35 */
export const $35_STATE_KEY = 'clientAlertDialog';
/** New Twitch bookmark dialog state. @id 36 */
export const $36_STATE_KEY = 'newTwitchBookmarkDialog';
/** Edit Twitch bookmark dialog state. @id 37 */
export const $37_STATE_KEY = 'editTwitchBookmarkDialog';
/** New Twitch bookmark form state. @id 38 */
export const $38_STATE_KEY = 'newTwitchBookmarkForm';
/** Edit Twitch bookmark form state. @id 39 */
export const $39_STATE_KEY = 'editTwitchBookmarkForm';
/** Research app page state. @id 40 */
export const $40_STATE_KEY = 'research-app';
/** Sign-in form state. @id 41 */
export const $41_STATE_KEY = 'signInForm';
/** Sign-in page state. @id 42 */
export const $42_STATE_KEY = 'sign-in';
/** Dev signed in page state. @id 43 */
export const $43_STATE_KEY = 'dev-signed-In';
/** Dev install page state. @id 44 */
export const $44_STATE_KEY = 'dev-install';
/** Dev test thumbnail form state. @id 45 */
export const $45_STATE_KEY = 'devTestThumbnailForm';
/** Dev test thumbnail page state. @id 46 */
export const $46_STATE_KEY = 'dev-test-thumbnail';
/** Dev install form state. @id 47 */
export const $47_STATE_KEY = 'devInstallForm';
/** Research app errors view page state. @id 48 */
export const $48_STATE_KEY = 'research-app-errors-view';
/** Dev set authorization key form state. @id 49 */
export const $49_STATE_KEY = 'devSetAuthorizationKeyForm';
/** Dev set authorization URL form state. @id 50 */
export const $50_STATE_KEY = 'devSetAuthorizationUrlForm';
/** Chipped listing page state. @id 51 */
export const $51_STATE_KEY = 'listing/:id';
export const $52_STATE_KEY = '<taken>';
/** Admin readable page state. @id 53 */
export const $53_STATE_KEY = 'admin-readable';
/** Dev test rumble regexp form state. @id 54 */
export const $54_STATE_KEY = 'devTestRumbleRegexpForm';
/** Admin config app page state. @id 55 */
export const $55_STATE_KEY = 'admin-config-app';
/**Dev test rumble regexp page state. @id 56 */
export const $56_STATE_KEY = 'dev-test-rumble-regexp';
/** Dev test unknown regexp form state. @id 57 */
export const $57_STATE_KEY = 'devTestUnknownRegexpForm';
/** Dev test unknown regexp page state. @id 58 */
export const $58_STATE_KEY = 'dev-test-unknown-regexp';
/** Dev Twitch input client ID page state. @id 59 */
export const $59_STATE_KEY = 'dev-twitch-input-client-id';
/** Dev Twitch input client ID form state. @id 60 */
export const $60_STATE_KEY = 'devTwitchInputClientIdForm';
/** Dev save config value page state. @id 61 */
export const $61_STATE_KEY = 'save-config-value';
/** Dev save config value form state. @id 62 */
export const $62_STATE_KEY = 'devSaveConfigValueForm';
/** Research page app bar state. @id 63 */
export const $63_STATE_KEY = 'researchPageAppbar';
/** Response alert dialog state. @id 64 */
export const $64_STATE_KEY = 'responseAlertDialog';
/** Alert dialog state. @id 65 */
export const $65_STATE_KEY = 'alertDialog';
/** Logout link state. @id 66 */
export const $66_STATE_KEY = 'powerLogoutLink';
/** Sign-in link state. @id 67 */
export const $67_STATE_KEY = 'powerSignInLink';
/** Confirm logout dialog state. @id 68 */
export const $68_STATE_KEY = 'confirmLogoutDialog';
/** Register form state. @id 69 */
export const $69_STATE_KEY = 'registerForm';
/** Listing (research alias). @id 70 */
export const $70_STATE_KEY = 'listing';
/** Listing page app bar state. @id 71 */
export const $71_STATE_KEY = 'listingPageAppbar';
