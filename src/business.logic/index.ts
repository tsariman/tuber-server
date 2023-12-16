import Config from '../config'
import {
  IGenericObject,
  IJsonapiQuerystring,
  TThemeMode
} from '../common.types'
import { THEME_MODE } from '../constants'

/** Returns `true` if the argument is an object. */
export const is_object = (obj: any) => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

/**
 * Convert object into query string with brackets. e.g.
 * ```ts
 * const obj = {
 *   page: {
 *     size: 10,
 *     number: 1
 *   }
 * }
 * ```
 * becomes:
 * ```ts
 * '?page[size]=10&page[number]=1&'
 * ```
 */
export const bracketize_object_querystring = (
  obj: any,
  parentKey = '?',
  depth = 0
): string => {
  if (!is_object(obj)) return obj
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key]
    if (is_object(value)) {
      parentKey = depth === 0 ? key : `${parentKey}[${key}]`
      return acc + bracketize_object_querystring(
        value, parentKey, depth + 1
      )
    }
    const bracketizedKey = depth === 0 ? key : `${parentKey}[${key}]`
    return acc + `${bracketizedKey}=${value}&`
  }, depth === 0 ? parentKey : '')
}

/** Insert state fragment using `_key` as key. */
export const set_state_by_key = (
  state: IGenericObject,
  fragment: IGenericObject
) => {
  const _key = fragment['_key']
  if (!_key) Config.die('Fragment must have a `_key`.')
  state[_key] = fragment
}

/**
 * Retrieves the value of `_key` from the given state.
 * @param state State object
 * @returns `_key` value
 */
export const get_state_key = (state: IGenericObject): string => {
  const _key: string = state['_key']
  if (!_key) Config.die('Fragment must have a `_key`.')
  return _key
}

/**
 * **`[system theme]`** Given a _key_, returns the state based on the current
 * theme mode.
 * @param state State object
 * @param LIGHT Light theme value
 * @param DARK Dark theme value
 * @returns the version of the state based on theme mode.
 */
export function themed_by_key<T=any>(key: string, LIGHT: any, DARK: any): T {
  const mode = Config.read<TThemeMode>(
    THEME_MODE,
    Config.DEFAULT_THEME_MODE
  )
  return mode === 'dark' ? DARK[key as any] : LIGHT[key as any]
}

/**
 * __`[system theme]`__ Choose the version of the state to return based on the
 * current theme mode.
 * @param light state for light theme
 * @param dark state for dark theme
 * @returns state based on theme mode.
 */
export function sys_themed<T=any>(light: T, dark: T): T {
  const mode = Config.read<TThemeMode>(
    THEME_MODE,
    Config.DEFAULT_THEME_MODE
  )
  return mode === 'dark' ? dark : light
}

/**
 * __`[user theme]`__ Chooses the version of the state to return based on the
 * current theme mode.
 * @param mode theme mode
 * @param light state for light theme
 * @param dark state for dark theme
 * @returns state based on theme mode.
 */
export function themed<T=any>(light: T, dark: T, mode?: TThemeMode): T {
  mode = mode ?? Config.read<TThemeMode>(
    THEME_MODE,
    Config.DEFAULT_THEME_MODE
  )
  return mode === 'dark' ? dark : light
}

/** Get query string value */
export const get_query = (
  req: any,
  key: keyof IJsonapiQuerystring,
  $default = ''
): string => {
  try {
    const query = req.query as IJsonapiQuerystring
    return query[key] ?? $default
  } catch (e: any) {
    Config.err(e.message)
  }
  return $default
}

/** Convert milliseconds to seconds or minutes */
export const ms_to_seconds = (ms: number) => {
  const seconds = ms / 1000
  if (seconds < 60) return `${seconds.toFixed(2)}s`
  const minutes = seconds / 60
  return `${minutes.toFixed(2)}m`
}

/** Return a limited number of document in an array if its length exceed the provided limit */
export const limit_array = <T=any>(arr: T[], limit: number): T[] => {
  return arr.length > limit ? arr.slice(0, limit) : arr
}

/**
 * Get the date of the given time.
 *
 * @param time in milliseconds
 * @returns new `Date` object.
 */
export function get_expiration_date(time: number) {
  const newTimeInMs = Date.now() + time
  const newDate = new Date()
  newDate.setTime(newTimeInMs)
  return newDate
}

/**
 * Given an array of regular expression, iterate and execute each regular
 * expression in sequential order on the given string.
 * Once there's a match, return the match.
 */
export function match_regex_array(
  str: string,
  regexArray: RegExp[]
): RegExpMatchArray | null {
  for (const regex of regexArray) {
    const match = str.match(regex)
    if (match) {
      Config.log(`[DEBUG] Matched: ${regex}`)
      return match
    }
  }
  return null
}

export function remove_form_suffix(_key?: string) {
  if (!_key) {
    Config.die('formState._key not defined.')
    return ''
  }
  return _key.slice(-4) === 'Form'
    ? _key.replace('Form', '')
    : _key
}

/**
 * Parse cookie string into an object.
 * @param cookieString Cookie string
 * @returns object
 */
export function parse_cookie(cookieString?: string) {
  if (!cookieString) return {}
  const cookies = {} as Record<string, string>
  const pairs = cookieString.split(';')

  pairs.forEach(pair => {
    const [key, value] = pair.split('=').map(s => s.trim())
    cookies[key] = value
  })

  return cookies
}

/**
 * Get the theme mode from the cookie string.
 *
 * @param cookieString 
 * @returns theme mode
 */
export function get_theme_mode(cookieString?: string): TThemeMode {
  const userMode = parse_cookie(cookieString).mode as TThemeMode
  const systemMode = Config.read<TThemeMode>(
    THEME_MODE,
    Config.DEFAULT_THEME_MODE
  )
  return userMode ?? systemMode
}
