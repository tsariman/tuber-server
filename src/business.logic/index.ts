import { FastifyRequest } from 'fastify'
import Config from 'src/config'
import { IGenericObject, IJsonapiQuerystring } from './common.types'

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

/** Retrieve the value of `_key` from state */
export const get_state_key = (state: IGenericObject) => {
  const _key = state['_key']
  if (!_key) Config.die('Fragment must have a `_key`.')
  return _key
}

/** Get query string value */
export const get_query = (req: FastifyRequest, key: keyof IJsonapiQuerystring, $default = ''): string => {
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
