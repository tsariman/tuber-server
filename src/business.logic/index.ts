import { 
  die,
  has_property,
  is_object,
  is_record,
  parse_cookie
} from '../utility';
import Config from '../config';
import {
  IJsonapiQuerystring,
  TObj,
  TThemeMode
} from '../common.types';
import { THEME_MODE } from '../constants.server';
import { FastifyRequest } from 'fastify';
import { ler, log, log_err } from '../utility/logging';
import { get_current_language_key, READABLE_CACHE } from './cache';

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
  obj: unknown,
  parentKey = '?',
  depth = 0
): string => {
  if (typeof obj === 'string') return obj;
  if (is_record(obj)) {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];
      if (is_object(value)) {
        parentKey = depth === 0 ? key : `${parentKey}[${key}]`;
        return acc + bracketize_object_querystring(
          value, parentKey, depth + 1
        );
      }
      const bracketizedKey = depth === 0 ? key : `${parentKey}[${key}]`;
      return acc + `${bracketizedKey}=${value}&`
    }, depth === 0 ? parentKey : '');
  }
  throw new Error(`obj is '${typeof obj}'. Should be an object or a string`);
}

/** Insert `fragment` into `state` at property `_key`. */
export const set_state_by_key = <T, K>(
  state: T,
  fragment: K
) => {
  if (is_object(state) && has_property<string>(fragment, '_key')) {
    if (!fragment._key) die('Fragment must have a valid `_key`.');
    (state as TObj)[fragment._key] = fragment;
    return;
  }
  ler('state', state);
  ler('fragment', fragment);
  throw new Error(`Failed to include state using '_key'.`);
}

/**
 * Retrieve the value of `_key` from the given state.
 * @param state State object
 * @returns `_key` value
 */
export const get_state_key = <T>(state: T): string => {
  if (has_property<string>(state, '_key')) {
    return state._key;
  }
  ler('[ERROR] Invalid state', state);
  throw new Error(`Argument is either not a state or '_key' is invalid`);
}

/**
 * **`[system theme]`** Given a _key_, returns the state based on the current
 * theme mode.
 * @param state State object
 * @param LIGHT Light theme value
 * @param DARK Dark theme value
 * @returns the version of the state based on theme mode.
 */
export function themed_by_key<T = unknown>(
  key: string,
  LIGHT: TObj<T>,
  DARK: TObj<T>
): T {
  const mode = Config.read<TThemeMode>(
    THEME_MODE,
    Config.DEFAULT_THEME_MODE
  );
  return mode === 'dark' ? DARK[key] : LIGHT[key];
}

/**
 * __`[system theme]`__ Choose the version of the state to return based on the
 * current theme mode.
 * @param light state for light theme
 * @param dark state for dark theme
 * @returns state based on theme mode.
 */
export function sys_themed<T=unknown>(light: T, dark: T): T {
  const mode = Config.read<TThemeMode>(
    THEME_MODE,
    Config.DEFAULT_THEME_MODE
  );
  return mode === 'dark' ? dark : light;
}

/**
 * __`[user theme]`__ Chooses the version of the state to return based on the
 * current theme mode.
 * @param mode theme mode
 * @param light state for light theme
 * @param dark state for dark theme
 * @returns state based on theme mode.
 */
export function themed<T=unknown>(light: T, dark: T, mode?: TThemeMode): T {
  mode = mode ?? Config.read<TThemeMode>(
    THEME_MODE,
    Config.DEFAULT_THEME_MODE
  );
  return mode === 'dark' ? dark : light;
}

/** Get query string value */
export const get_query = <T = string>(
  req: FastifyRequest<{ Querystring: IJsonapiQuerystring }>,
  key: keyof IJsonapiQuerystring,
  $default: T
): T => {
  try {
    const query = req.query;
    const value = query[key];
    return (value ?? $default) as T;
  } catch (e) {
    log_err((e as Error).message, e);
  }
  return $default;
}

/** Get request body value */
export const get_body = <T = unknown>(
  req: FastifyRequest<{ Body: Record<string, T>}>,
  key: string,
  $default: T
): T => {
  try {
    const body = req.body;
    return body?.[key] ?? $default;
  } catch (e) {
    log_err((e as Error).message, e);
  }
  return $default;
}

/** Convert milliseconds to seconds or minutes */
export const ms_to_seconds = (ms: number) => {
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(2)}s`;
  const minutes = seconds / 60;
  return `${minutes.toFixed(2)}m`;
}

/** Return a limited number of document in an array if its length exceed the provided limit */
export const limit_array = <T=unknown>(arr: T[], limit: number): T[] => {
  return arr.length > limit ? arr.slice(0, limit) : arr;
}

/**
 * Get the date of the given time.
 *
 * @param time in milliseconds
 * @returns new `Date` object.
 */
export function get_expiration_date(time: number) {
  const newTimeInMs = Date.now() + time;
  const newDate = new Date();
  newDate.setTime(newTimeInMs);
  return newDate;
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
    const match = str.match(regex);
    if (match) {
      log(`[DEBUG] Matched: ${regex}`);
      return match;
    }
  }
  return null;
}

export function remove_form_suffix(_key?: string) {
  if (!_key) {
    die('formState._key not defined.');
    return '';
  }
  return _key.slice(-4) === 'Form'
    ? _key.replace('Form', '')
    : _key;
}

/**
 * Check if the request body has a cookie property set.
 * @param req FastifyRequest object
 * @returns true if cookie exists, false otherwise
 */
export function has_cookie(req: FastifyRequest<{ Body: { cookie?: string } }>): boolean {
  return !!(req.body && req.body.cookie);
}

/**
 * Get the theme mode from the cookie string.
 *
 * @param cookieString 
 * @returns theme mode
 */
export function get_theme_mode(cookieString?: string): TThemeMode {
  const userMode = parse_cookie(cookieString).mode as TThemeMode;
  if (userMode) {
    Config.write(THEME_MODE, userMode);
    return userMode;
  }
  const mode = Config.read<TThemeMode>(
    THEME_MODE,
    Config.DEFAULT_THEME_MODE
  )
  return mode;
}

/**
 * Option selector.
 *
 * @param element
 * @param options 
 * @returns `a` if `element` is in `options`, otherwise `b`.
 */
export function option<T=unknown> (
  options?: string[]
): (element: string, a: T, b: T) => T {
  return (element: string, a: T, b: T): T => {
    if (!options) return b;
    return options.includes(element)
      ? a
      : b;
  };
}

/**
 * Get readable text from the readable cache, if it exist. Otherwise, the
 * default provided text will be returned.
 *
 * @param key a unique identifier for the readable text in the database.
 *            It's value should be available for developers when viewing
 *            the elements HTML, client-side.
 * @param $default Default value is required... :(
 * @returns 
 */
export function t<T>(key: string, $default: T): T {
  const lang_key = get_current_language_key();
  const languageCache = READABLE_CACHE.get(lang_key);

  if (!languageCache) {
    // log_err(`Language cache not found for: ${lang_key}`);
    return $default;
  }

  const v = languageCache.get(key);
  if (typeof $default === 'string') {
    return (typeof v === 'string' ? v : $default) as T;
  }
  return (v ?? $default) as T;
}

/** Shallow clone that preserves getters/setters and prototype (no spread). */
export function clone_with_descriptors<T extends object>(source: T): T {
  const target = (Array.isArray(source)
    ? new Array(source.length)
    : Object.create(Object.getPrototypeOf(source))) as T;
  return Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
}

/**
 * Shallow clone that preserves getters/setters and prototype (no spread).
 *
 * @returns object clone or default value
 */
export function clone_or_default<T extends object>(
  source: T | null | undefined, defaultValue: T
): T {
  return source ? clone_with_descriptors(source) : defaultValue;
}

/** Get empty version of the passed argument with the same type. */
export function clone_empty<T extends object>(source: T | null | undefined): T {
  if (!source) {
    return {} as T;
  }

  if (Array.isArray(source)) {
    return [] as T;
  }

  // Create empty object with same prototype
  return Object.create(Object.getPrototypeOf(source)) as T;
}