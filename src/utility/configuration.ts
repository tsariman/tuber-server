
/** Reserved methods/keys of the configuration object. */
export interface IConfigMethods {
  readonly init: (data?: any) => void
  readonly set: (path: string, val: any) => void
  readonly read: <T=any>(path: string) => T
  readonly write: <T=any>(path: string, val: T) => void
  readonly delete: (path: string) => void
  readonly clear: () => void
}

/** Reserved configuration keys. */
type TReservedKeys = keyof IConfigMethods

/**
 * **WARNING**
 * Do not add any new methods to this interface.
 * However, if you absolutely need to, make sure to add that method name to the
 * `invalidKeys` array below.
 * You've been warned.
 */
export interface IConfiguration extends IConfigMethods {
  [key: string]: any
}

let writable: boolean = false
let $delete: boolean = false

/**
 * Adds a new property and value to an object.
 *
 * @param obj arbitrary object
 * @param prop new property name
 * @param val the value at that property
 */
const create_property = (obj: any, prop: string, val: any): void => {
  Object.defineProperty(obj, prop, {
    value: val,
    writable
  })
}

/**
 * **WARNING**  
 * BUG ALERT!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!  
 * If you add a new method to the interface above, make sure to insert the name
 * of that method as a property in this object with a truthy value.
 * If you don't, your method key may be overwritten when setting or writting
 * values in the configuration object if the specified key is the same
 * as the name of the method you just created.
 */
const invalid_keys: {[key in TReservedKeys]: number} = {
  'init': 1,
  'set': 1,
  'read': 1,
  'write': 1,
  'clear': 1,
  'delete': 1
}

/**
 * Resolves an object value from a period-separated list of object properties.
 *
 * This is a new implementation of `resolve()` that does not use a for-loop.
 *
 * TODO finish implementing this function
 *
 * @param obj  arbitrary object.
 * @param path a string containing the dot-separated list of object properties.
 *             e.g. "pagination.users.limit"
 */
const resolve = (obj: any, path: string, val?: any): any => {
  const propArray = path.split('.')
  let o = obj,
    candidate: any,
    j = 0

  do {
    let prop = propArray[j]
    candidate = o[prop]

    // if this is the last property
    if (j >= (propArray.length - 1)) {
      if (val) {
        create_property(o, prop, val)
        return val
      } else if ($delete) {
        o[prop] = undefined
      }
      return candidate

      // if the property does not exist but a value was provided
    } else if (!candidate && val) {
      create_property(o, prop, {})
    }
    o = o[prop]
    j++
  } while (1)

}

const config: IConfiguration = {

  init: (data?: any): void => {
    writable = false
    if (data && typeof data === 'object' && !Array.isArray(data)) {
      for (const key in data) {
        if (!(key in invalid_keys)) { // if key is invalid
          config[key] = data[key]
        } else {
          console.log(`'${key}' cannot be specified as a key.`)
        }
      }
    }
  },

  set: (path: string, val: any): void => {
    resolve(config, path, val)
  },

  /**
   * Reads a value
   *
   * @param prop period-seperated list of properties
   */
  read: <T=any>(path: string): T => {
    return resolve(config, path)
  },

  /**
   * Saves a value
   *
   * This value is mutable
   *
   * @param prop period-seprated list of properties
   * @param val value to be saved.
   */
  write: <T=any>(path: string, val: T): void => {
    writable = true
    resolve(config, path, val)
    writable = false
  },

  /** Delete a property. */
  delete: (path: string): void => {
    $delete = true
    resolve(config, path)
    $delete = false
  },

  /**
   * Use this method if you want to remove all values from the config object.
   */
  clear: (): void => {
    for (const configKey in config) {
      delete config[configKey]
    }
  }
}

export default config
