import { IDbConfigurationDocument } from '../schema/configuration'
import { configuration_save } from '../model/configuration'
import { TObj } from '../common.types'

/** Reserved methods/keys of the configuration object. */
export interface IConfigMethods {
  readonly init: (data?: Record<string, unknown>) => void
  /**
   * Load a configuration value from the database.
   * @param docs array of configuration documents
   */
  readonly load: (docs: IDbConfigurationDocument[]) => Promise<void>
  /**
   * Set a configuration value in memory only. However, the value is read only.
   * @param path period-separated list of properties
   * @param val value to be saved.
   */
  readonly set: (path: string, val: unknown) => void
  /**
   * Save a configuration value to the database. The value can be changed at 
   * any time.
   * @param path period-separated list of properties
   * @param val value to be saved.
   */
  readonly save: <T=unknown>(path: string, val: T) => Promise<IDbConfigurationDocument>
  /** 
   * Read a configuration value which was previously set with `write()`,
   * `set()`, or `save()`.
   * @param path period-separated list of properties
   * @param $default default value to be returned if the value is not found.
   */
  readonly read: <T=unknown>(path: string, $default?: T) => T
  /**
   * Set a configuration value in memory only. The value can be changed at any
   * time.
   * @param path period-separated list of properties
   * @param val value to be saved.
   */
  readonly write: <T=unknown>(path: string, val?: T) => void
  /**
   * Delete a configuration value.
   * @param path period-separated list of properties
   */
  readonly delete: (path: string) => void
  /** Clear all configuration values. */
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
  [key: string]: unknown
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
const create_property = <T=TObj,K=unknown>(obj: T, prop: string, val: K): void => {
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
  'load': 1,
  'set': 1,
  'save': 1,
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
const resolve = <T=unknown,K=TObj<T>>(obj: K, path: string, val?: T): T => {
  const propArray = path.split('.')
  let o = obj,
    candidate: unknown,
    j = 0

  do {
    let prop = propArray[j]
    candidate = (o as TObj)[prop]

    // if this is the last property
    if (j >= (propArray.length - 1)) {
      if (val) {
        create_property(o, prop, val)
        return val
      } else if ($delete) {
        (o as TObj)[prop] = undefined
      }
      return candidate as T

      // if the property does not exist but a value was provided
    } else if (!candidate && val) {
      create_property(o, prop, {})
    }
    o = (o as TObj)[prop] as K
    j++
  } while (1)
  throw new Error('[ERROR] resolve() failed.')
}

const config: IConfiguration = {

  init: (data?: Record<string, unknown>): void => {
    writable = false
    if (data) {
      for (const key in data) {
        if (!(key in invalid_keys)) { // if key is invalid
          config[key] = data[key]
        } else {
          console.error(`'${key}' cannot be specified as a key.`)
        }
      }
    }
  },

  /**
   * Load configuration from the database.
   * @param docs array of configuration documents
   */
  load: async (docs: IDbConfigurationDocument[]): Promise<void> => {
    writable = false
    docs.forEach(doc => {
      if (!(doc.key in invalid_keys)) { // if key is invalid
        config[doc.key] = doc.value
      } else {
        console.error(`[ERROR] '${doc.key}' cannot be specified as a key.`)
      }
    })
  },

  set: <T=unknown>(path: string, val: T): void => {
    resolve(config, path, val)
  },

  save: async <T=unknown>(path: string, val: T): Promise<IDbConfigurationDocument> => {
    writable = true
    resolve(config, path, val)
    writable = false
    
    // Properly serialize the value
    const serializedValue = typeof val === 'string' ? val : JSON.stringify(val)
    return await configuration_save(path, serializedValue)
  },

  /**
   * Reads a value
   *
   * @param prop period-seperated list of properties
   */
  read: <T=unknown>(path: string, $default?: T): T => {
    return (resolve(config, path) ?? $default) as T
  },

  write: <T=unknown>(path: string, val: T): void => {
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
