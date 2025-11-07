import { TJsonapiStateResponse } from '@tuber/shared';

export type TTextField = 'label'|'has_label'|'title'|'text';

export default abstract class AbstractStateBuilder {
  private _debugging = process.env.NODE_ENV === 'development'
  || process.env.DEBUG === 'true';
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
  abstract with_Id(_id: string): unknown;
  /**
   * Set the key of the state.
   * @param {string} _key
   * @returns {unknown} this.
   */
  abstract with_Key(_key: string): unknown;
  abstract configure(co: object): unknown;
  /** Makes a stand alone state that can be returned as a HTTP response. */
  abstract withBootstrapState(): unknown;
  protected responseNotDefined(): never {
    throw new Error('Response is not defined. Did you forget to call `withBootstrapState()`?');
  }
  protected bootstrapNotAvailable(): never {
    throw new Error('Bootstrap is not implemented.');
  }
  protected ler<T=unknown>(value: T, $return: T): T {
    if (this._debugging) {
      console.log(value);
    }
    return $return;
  }
  protected warn<T=unknown>(value: T, $return: T): T {
    if (this._debugging) {
      console.warn(value);
    }
    return $return;
  }
  protected notice<T=unknown>(value: T, $return: T): T {
    if (this._debugging) {
      console.info(value);
    }
    return $return;
  }
  protected die<T=unknown>(msg: string, $return: T): T {
    if (this._debugging) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIf<T=unknown>(condition: boolean, msg: string, $return: T): T {
    if (this._debugging && condition) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNot<T=unknown>(condition: boolean, msg: string, $return: T): T {
    if (this._debugging && !condition) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNull<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (this._debugging && value === null) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfUndefined<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (this._debugging && value === undefined) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNullOrUndefined<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (this._debugging && (value === null || value === undefined)) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotString<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (this._debugging && typeof value !== 'string') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotNumber<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (this._debugging && typeof value !== 'number') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotBoolean<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (this._debugging && typeof value !== 'boolean') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotArray<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (this._debugging && !Array.isArray(value)) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotObject<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (this._debugging && typeof value !== 'object') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotFunction<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (this._debugging && typeof value !== 'function') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotRegExp<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (this._debugging && !(value instanceof RegExp)) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotDate<T=unknown>(value: unknown, msg: string, $return: T): T {
    if (this._debugging && !(value instanceof Date)) {
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