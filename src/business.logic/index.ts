import Config from "src/config"
import { IGenericObject } from "src/utility/common.types"

/** Returns `true` if the argument is an object. */
export const is_object = (obj: any) => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

/**
 * Converts object into query string with brackets. e.g.
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