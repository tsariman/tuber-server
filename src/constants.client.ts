
// state

/** @deprecated */
export const APP_IS_BOOTSTRAPPED   = 'APP_IS_BOOTSTRAPPED'
/** @deprecated */
export const APP_IS_FETCHING       = 'APP_IS_FETCHING'
/** @deprecated */
export const APP_IS_READY          = 'APP_IS_READY'
/** @deprecated */
export const APP_SWITCHED_PAGE     = 'APP_SWITCHED_PAGE'
/** @deprecated */
export const APP_BROWSER_SWITCHED_PAGE = 'APP_BROWSER_SWITCHED_PAGE'
/** @deprecated */
export const APP_REQUEST_FAILED    = 'APP_REQUEST_FAILED'
/** @deprecated */
export const APP_REQUEST_SUCCESS   = 'APP_REQUEST_SUCCESS'

/** @deprecated */
export const ERRORS_ADD = 'errors/errorsAdd'
/** @deprecated */
export const ERRORS_REMOVE = 'errors/errorsRemove'
/** @deprecated */
export const ERRORS_CLEAR = 'errors/errorsClear'

/** @deprecated */
export const NET_STATE_PATCH = 'NET_STATE_PATCH'
/** @deprecated */
export const STATE_RESET = 'STATE_RESET'

// layouts

/** @deprecated */
export const LAYOUT_CENTERED = 'layout_centered'
/** @deprecated */
export const LAYOUT_CENTERED_NO_SCROLL = 'layout_centered_no_scroll'
/** @deprecated */
export const LAYOUT_MINI_DRAWER_CONTENT = 'layout_mini_drawer_content'
/** @deprecated */
export const LAYOUT_TABLE_VIRTUALIZED = 'layout_table_virtualized'
/** @deprecated */
export const LAYOUT_DEFAULT = 'layout_default'
/** @deprecated */
export const LAYOUT_NONE = 'layout_none'
/** @deprecated */
export const LAYOUT_NONE_NO_APPBAR = 'layout_none_no_appbar'

/** @deprecated */
export const LAYOUT_MD = 'layout_md'
/** @deprecated */
export const LAYOUT_SM = 'layout_sm'
/** @deprecated */
export const LAYOUT_XL = 'layout_xl'
/** @deprecated */
export const LAYOUT_XS = 'layout_xs'

// contents

/** @deprecated */
export const APP_CONTENT_VIEW = '$view'
/** @deprecated */
export const DEFAULT_BLANK_PAGE = 'default-blank'
/** @deprecated */
export const DEFAULT_LANDING_PAGE = 'default-landing'
/** @deprecated */
export const DEFAULT_NOT_FOUND_PAGE = 'default-notfound'

// views

/** @deprecated */
export const DEFAULT_LANDING_PAGE_VIEW = 'default_landing_page_view'
/** @deprecated */
export const DEFAULT_SUCCESS_PAGE_VIEW = 'default_success_page_view'
/** @deprecated */
export const DEFAULT_NOTFOUND_PAGE_VIEW = 'default_notfound_page_view'
/** @deprecated */
export const DEFAULT_ERRORS_PAGE_VIEW = 'default_errors_page_view'
/** @deprecated */
export const DEFAULT_BLANK_PAGE_VIEW = 'default_blank_page_view'

// form items

/** @deprecated */
export const BREAK_LINE = 'br'
/** @deprecated */
export const BOOL_ONOFF = 'bool_onof'
/** @deprecated */
export const BOOL_TRUEFALSE = 'bool_truefalse'
/** @deprecated */
export const BOOL_YESNO = 'bool_yesno'
/** @deprecated */
export const BOX = 'box'
/** @deprecated */
export const STATE_BUTTON = 'state_button'
/** @deprecated */
export const CHECKBOXES = 'checkboxes'
/** @deprecated */
export const DATE_TIME_PICKER = 'date_time_picker'
/** @deprecated */
export const DESKTOP_DATE_PICKER = 'desktop_date_picker'
/** @deprecated */
export const DESKTOP_DATE_TIME_PICKER = 'desktop_date_time_picker'
/** @deprecated */
export const DIV = 'div'
/** @deprecated */
export const A = 'a'
/** @deprecated */
export const FORM = 'form'
/** @deprecated */
export const FORM_CONTROL = 'form_control'
/** @deprecated */
export const FORM_CONTROL_LABEL = 'form_control_label'
/** @deprecated */
export const FORM_GROUP = 'form_group'
/** @deprecated */
export const FORM_HELPER_TEXT = 'form_helper_text'
/** @deprecated */
export const FORM_LABEL = 'form_label'
/** @deprecated */
export const HIGHLIGHT = 'highlight'
/** @deprecated */
export const HORIZONTAL_LINE = 'hr'
/** @deprecated */
export const HTML = 'html'
/** @deprecated */
export const HTML_TAG = 'html_tag'
/** @deprecated */
export const INDETERMINATE = 'indeterminate'
/** @deprecated */
export const STATE_INPUT = 'state_input'
/** @deprecated */
export const INPUT_LABEL = 'input_label'
/** @deprecated */
export const ICON = 'icon'
/** @deprecated */
export const LINK = 'link'
/** @deprecated */
export const LOCALIZED = 'localized'
/** @deprecated */
export const MOBILE_DATE_PICKER  = 'mobile_date_picker'
/** @deprecated */
export const MOBILE_DATE_TIME_PICKER = 'mobile_date_time_picker'
/** @deprecated */
export const NONE = 'none'
/** @deprecated */
export const NUMBER = 'number'
/** @deprecated */
export const PARAGRAPH = 'paragraph'
/** @deprecated */
export const PASSWORD = 'password'
/** @deprecated */
export const PHONE_INPUT = 'phone_input'
/** @deprecated */
export const RADIO_BUTTONS = 'radio_buttons'
/** @deprecated */
export const STATE_SELECT = 'state_select'
/** @deprecated */
export const STATE_SELECT_NATIVE = 'state_select_native'
/** @deprecated */
export const STACK = 'stack'
/** @deprecated */
export const STATIC_DATE_PICKER = 'static_date_picker'
/** @deprecated */
export const SUBMIT = 'submit'
/** @deprecated */
export const SWITCH_SINGLE = 'switch_single'
/** @deprecated */
export const SWITCH = 'switch'
/** @deprecated */
export const TEXT = 'text'
/** @deprecated */
export const TEXTAREA = 'textarea'
/** @deprecated */
export const TEXTFIELD = 'textfield'
/** @deprecated */
export const TEXT_NODE = 'text_node'
/** @deprecated */
export const TIME_PICKER = 'time_picker'
/** @deprecated */
export const DEFAULT = 'default'
/** @deprecated */
export const BAD_FORM_ITEM = ''

// miscellanous

/** @deprecated */
export type TCallback = (e: unknown) => void
/** @deprecated */
export const THEME_MODE = 'theme_mode'
/** @deprecated */
export const THEME_DEFAULT_MODE = 'dark'

/** Type for page layout. @deprecated */
export type TStatePageLayout =
    typeof LAYOUT_CENTERED_NO_SCROLL
  | typeof LAYOUT_CENTERED
  | typeof LAYOUT_DEFAULT
  | typeof LAYOUT_MD
  | typeof LAYOUT_NONE
  | typeof LAYOUT_NONE_NO_APPBAR
  | typeof LAYOUT_SM
  | typeof LAYOUT_TABLE_VIRTUALIZED
  | typeof LAYOUT_XL
  | typeof LAYOUT_XS

/** @deprecated */
export const DRAWER_DEFAULT_WIDTH = 300

/**
 * Limits the number of time the app attempts to load a page state from the
 * server if none was defined.
 *
 * **Warning:** This fixes a bug where the app infinitely attempts to load
 * state from server.
 * @deprecated This should be removed in favor of a more robust solution to the underlying issue of infinite loading attempts.
 */
export const ALLOWED_ATTEMPTS = 1

// messages
/** @deprecated */
export const ROOT_DEF_FORBIDDEN = `Access to parent root state is not
  implemented for performance reasons.`
export const NAME_NOT_SET = 'NAME NOT SET!'
/** @deprecated */
export const LAST_DRAWER_STATE = 'last_drawer_state'
/** @deprecated */
export const NOT_FOUND = -1
/** @deprecated */
export const NET_STATE_PATCH_DELETE = '__DELETE__'
/** @deprecated */
export const BOOTSTRAP_ATTEMPTS = 'bootstrap_attempts'
