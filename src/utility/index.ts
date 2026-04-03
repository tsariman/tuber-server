// WARNING Do not import anything. If you have to import, it doesn't belong
//         here.

type TO = Record<string, unknown>

/** Basic error interface */
export interface IError { name: string; message: string; stack?: string }
export interface INetError<T = unknown> extends IError {
  response: T
}
/** Basic JSON:API response interface */
export interface IJsonapiResponse {
  data: TO | TO[]
  errors?: TO[]
  meta?: TO
}

/** Throws an error in development mode. Does nothing in production. */
export const die = (message: string): void => {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(message)
  }
}

/** Checks if the argument is a string. Returns `true` if it is. */
export const is_string = (value: unknown): value is string => {
  return typeof value === 'string'
}

/** Checks if the argument is an object. Returns `true` if it is. */
export const is_object = (obj: unknown): obj is object => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

/** Checks if the argument is a record. Returns `true` if it is. */
export const is_record = <T=unknown>(obj: unknown): obj is Record<string, T> => {
  return is_object(obj)
}

/** Checks if the argument is a potential instance. Returns `true` if it is. */
export const is_instance = <T=Record<string, unknown>>(obj: unknown): obj is T => {
  return is_object(obj)
}

/** Checks if the argument is an object or array. Returns `true` if it is. */
export const is_struct = <T>(obj: T): obj is T => {
  return typeof obj === 'object' && obj !== null
}

/** Get a guaranteed `object` even if argument is undefined. */
export const assure = <T = TO>(obj: T | undefined): T => {
  return (obj ?? {}) as T
}

/**
 * Same as `assure()`. Get a guaranteed object even if argument is undefined.
 * However, the type must be specified.
 */
export const ensure = <T = object>(obj: unknown): T => {
  return (obj ?? {}) as T
}

/**
 * Check if an object contains a specific property
 * @param obj - The object to check
 * @param prop - The property name to look for
 * @returns Type predicate indicating if the object has the property
 */
export const has_property = <T=unknown>(obj: unknown, prop: string): obj is Record<string, T> => {
  return is_object(obj) && prop in obj
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

/** Normalize a key by removing leading slash if present. */
export const normalize_key = (key: string): string => {
  return key.charAt(0) === '/' ? key.substring(1) : key
}


/**
 * Converts an Error object to a plain object for easier serialization/logging
 * @param e The try-catch error to convert
 * @param name The name to assign if e is not an Error
 * @returns An object with name, message, and stack properties
 */
export const to_error_object = (e: unknown, name = 'UnknownError'): IError => {
  if (!(e instanceof Error)) {
    return {
      name,
      message: String(e),
      stack: undefined
    }
  }
  return { name: e.name, message: e.message, stack: e.stack }
}

/**
 * Converts a network-related error to an INetError object
 * @param e The try-catch error to convert
 * @returns An INetError object with response property if available
 */
export const to_net_error_object = <T = IJsonapiResponse>(e: unknown): INetError<T> => {
  const error = to_error_object(e)
  if (has_property(error, 'response')) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
      response: error.response as T
    }
  }
  return { ...error, response: undefined as T }
}

/**
 * Resolves a dot-separated path within a nested object.
 * @param obj - The root value to traverse
 * @param path - A dot-separated string of property names (e.g. `"a.b.c"`)
 * @returns An object containing the resolved `value` and its immediate `parent`
 */
export const resolve = (obj: unknown, path: string): { parent: unknown; value: unknown } => {
  const keys = path.split('.')
  let parent: unknown = undefined
  let current: unknown = obj

  for (const key of keys) {
    if (Array.isArray(current)) {
      const index = Number(key)
      if (!Number.isInteger(index) || index < 0) {
        return { parent, value: undefined }
      }
      parent = current
      current = current[index]
    } else if (is_record(current)) {
      parent = current
      current = current[key]
    } else {
      return { parent, value: undefined }
    }
  }

  return { parent, value: current }
}