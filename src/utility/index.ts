// WARNING Do not import anything. If you have to import, it doesn't belong
//         here.

type TObj = Record<string, unknown>

export const die = (message: string): void => {
  if (process.env.NODE_ENV === 'development') {
    throw new Error(message)
  }
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
export const assure = <T = TObj>(obj: T | undefined): T => {
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