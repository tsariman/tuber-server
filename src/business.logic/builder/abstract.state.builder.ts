import { TJsonapiStateResponse } from '../../shared';
import Config from '../../config';

export type TTextField = 'label'|'has_label'|'title'|'text';

export default abstract class AbstractStateBuilder {
  /** Get the state. @returns {unknown} state. */
  abstract build(): unknown;
  abstract buildResponse(): TJsonapiStateResponse;
  /**
   * Insert an item into array.
   *
   * @returns {unknown} this.
   */
  abstract add(instance: unknown): unknown;
  /**
   * Set the id of the state.
   * @param {string} _id
   * @returns {unknown} this.
   */
  abstract withId(_id: string): unknown;
  /**
   * Set the key of the state.
   * @param {string} _key
   * @returns {unknown} this.
   */
  abstract withKey(_key: string): unknown;
  abstract configure(co: object): unknown;
  /** Makes a stand alone state that can be returned as a HTTP response. */
  abstract withBootstrapState(): unknown;
  protected response_not_defined(): never {
    throw new Error('Response is not defined. Did you forget to call `withBootstrapState()`?');
  }
  protected ler<T=unknown>(value: T, $return: T): T {
    if (Config.DEBUG) {
      console.log(value);
    }
    return $return;
  }
  protected warn<T=unknown>(value: T, $return: T): T {
    if (Config.DEBUG) {
      console.warn(value);
    }
    return $return;
  }
  protected notice<T=unknown>(value: T, $return: T): T {
    if (Config.DEBUG) {
      console.info(value);
    }
    return $return;
  }
  protected die<T=unknown>(msg: string, $return: T): T {
    if (Config.DEBUG) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIf<T=unknown>(condition: boolean, msg: string, $return: T): T {
    if (Config.DEBUG && condition) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNot<T=unknown>(condition: boolean, msg: string, $return: T): T {
    if (Config.DEBUG && !condition) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNull<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (Config.DEBUG && value === null) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfUndefined<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (Config.DEBUG && value === undefined) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNullOrUndefined<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (Config.DEBUG && (value === null || value === undefined)) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotString<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (Config.DEBUG && typeof value !== 'string') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotNumber<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (Config.DEBUG && typeof value !== 'number') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotBoolean<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (Config.DEBUG && typeof value !== 'boolean') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotArray<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (Config.DEBUG && !Array.isArray(value)) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotObject<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (Config.DEBUG && typeof value !== 'object') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotFunction<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (Config.DEBUG && typeof value !== 'function') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotRegExp<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (Config.DEBUG && !(value instanceof RegExp)) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotDate<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (Config.DEBUG && !(value instanceof Date)) {
      throw new Error(msg);
    }
    return $return;
  }
}

export abstract class AbstractFormItemStateBuilder
  extends AbstractStateBuilder
{
  /** [ **REQUIRED** ] Form item must have a type. @returns this. */
  abstract withType(type: string): unknown;
}