import Config from '../config';
import {
  IJsonapiQuerystring,
  TObj,
  TThemeMode
} from '../common.types';
import { THEME_MODE } from '../constants.server';
import { FastifyRequest } from 'fastify';
import { log, log_err } from '../utility/logging';

export const die = (message: string): void => {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(message);
  }
}

/** Returns `true` if the argument is an object. */
export const is_object = (obj: unknown): obj is Object => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

/**
 * Check if an object contains a specific property
 * @param obj - The object to check
 * @param prop - The property name to look for
 * @returns Type predicate indicating if the object has the property
 */
export const has_property = <T extends string>(obj: unknown, prop: T): obj is Record<T, unknown> => {
  return is_object(obj) && prop in (obj as object);
};

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
  if (is_object(obj)) {
    return Object.keys(obj).reduce((acc, key) => {
      const value = (obj as TObj)[key];
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

/** Insert state fragment using `_key` as key. */
export const set_state_by_key = <T, K>(
  state: T,
  fragment: K
) => {
  const _key = (fragment as TObj)['_key'];
  if (!_key) die('Fragment must have a `_key`.');
  (state as TObj)[_key as string] = fragment;
}

/**
 * Retrieves the value of `_key` from the given state.
 * @param state State object
 * @returns `_key` value
 */
export const get_state_key = <T=TObj>(state: T): string => {
  const _key = (state as TObj)['_key'] as string;
  if (!_key) die('Fragment must have a `_key`.');
  return _key;
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
 * Parse cookie string into an object.
 * @param cookieString Cookie string
 * @returns object
 */
export function parse_cookie(cookieString?: string) {
  if (!cookieString) return {};
  const cookies = {} as Record<string, string>;
  const pairs = cookieString.split(';');

  pairs.forEach(pair => {
    const [key, value] = pair.split('=').map(s => s.trim());
    cookies[key] = value;
  })

  return cookies;
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
export function r<T>(key: string, $default: T): T {
  return Config.READABLE_CACHE.get(key) ?? $default;
}

