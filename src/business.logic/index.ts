
/** Returns `true` if the argument is an object. */
export const is_object = (obj: any) => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}
