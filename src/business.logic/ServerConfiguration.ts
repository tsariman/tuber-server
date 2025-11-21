import { AbstractConfiguration } from '@tuber/shared'
import { IDbConfigurationDocument } from '../schema/configurations'
import { configuration_save } from '../model/configuration'

export interface IConfigManager {
  /**
   * Initialize the configuration object with values.
   * @param data arbitrary object containing key-value pairs.
   * @returns void
   * @throws Error if data is not a record
   */
  init(data?: Record<string, unknown>): void
  /**
   * Save an immutable value.
   *
   * __WARNING__: This value is immutable. Attempting to set nested properties
   * on non-object intermediates will throw an error.
   * @param path period-separated list of properties
   * @param val value to be saved.
   * @returns void
   * @throws Error if path is invalid or if attempting to set on a non-object
   */
  set(path: string, val: unknown): void
  /**
   * Read a value.
   *
   * @param path period-separated list of properties
   * @param $default default value to return if the value at the specified path
   *                 is undefined.
   * @returns the value at the specified path or the default value.
   */
  read<T = unknown>(path: string, $default?: T): T
  /**
   * Save a mutable value.
   *
   * @param path period-separated list of properties
   * @param val value to be saved.
   * @returns void
   * @throws Error if path is invalid or if attempting to set on a non-object
   */
  write<T = unknown>(path: string, val: T): void
  /**
   * Delete a property.
   *
   * @param path period-separated list of nested properties
   * @returns void
   * @throws Error if path is invalid
   */
  delete(path: string): void
  /**
   * Use this method if you want to remove all values from the config object.
   */
  clear(): void
  /**
   * Asynchronously load configuration values from database documents.
   * @param docs array of database configuration documents
   * @returns Promise<void>
   */
  load(docs: IDbConfigurationDocument[]): Promise<void>
  /**
   * Asynchronously save a value to the database.
   * @param path period-separated list of properties
   * @param val value to be saved
   * @returns Promise of the saved database document
   */
  save<T = unknown>(path: string, val: T): Promise<IDbConfigurationDocument>
  /** Allows for populating the config object with arbitrary setting values. */
  [key: string]: unknown
}

export class ServerConfiguration extends AbstractConfiguration {
  /** Allows for populating the config object with arbitrary setting values. */
  [key: string]: unknown

  set(path: string, val: unknown): void {
    this.resolve(path, val, false, false)
  }
  read<T = unknown>(path: string, $default?: T): T {
    const result = this.resolve(path)
    return (result ?? $default) as T
  }
  write<T = unknown>(path: string, val: T): void {
    this.resolve(path, val, true)
  }
  delete(path: string): void {
    this.resolve(path, undefined, false, true)
  }
  clear(): void {
    this.config = {}
  }
  async save<T = unknown>(path: string, val: T): Promise<IDbConfigurationDocument> {
    this.resolve(path, val, true)
    // Properly serialize the value
    const serializedValue = JSON.stringify(val)
    return await configuration_save(path, serializedValue)
  }
  async load(docs: IDbConfigurationDocument[]): Promise<void> {
    docs.forEach(doc => {
      let parsedValue: unknown
      try {
        parsedValue = JSON.parse(doc.value)
      } catch {
        parsedValue = doc.value
      }
      this.resolve(doc.key, parsedValue, true)
    })
  }
}

/** Singleton instance for backward compatibility */
let configInstance: ServerConfiguration | null = null

/** Get the configuration instance. */
export default function get_config(): IConfigManager {
  return configInstance ??= new ServerConfiguration({})
}