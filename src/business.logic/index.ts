
/** Returns `true` if the argument is an object. */
export const is_object = (obj: any) => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

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
