import Config from '../config';

export type TTextField = 'label'|'has_label'|'title'|'text';

export default abstract class AbstractStateBuilder {
  /** Get the state. @returns {any} state. */
  abstract build(): any;
  /**
   * Insert an item into array.
   *
   * @returns {any} this.
   */
  abstract add(instance: any): any;
  /**
   * Set the id of the state.
   * @param {string} _id
   * @returns {any} this.
   */
  abstract with_Id(_id: string): any;
  /**
   * Set the key of the state.
   * @param {string} _key
   * @returns {any} this.
   */
  abstract with_Key(_key: string): any;
  protected ler<T=any>(value: T, $return: T): T {
    if (Config.DEBUG) {
      console.log(value);
    }
    return $return;
  }
  protected warn<T=any>(value: T, $return: T): T {
    if (Config.DEBUG) {
      console.warn(value);
    }
    return $return;
  }
  protected notice<T=any>(value: T, $return: T): T {
    if (Config.DEBUG) {
      console.info(value);
    }
    return $return;
  }
  protected die<T=any>(msg: string, $return: T): T {
    if (Config.DEBUG) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIf<T=any>(condition: boolean, msg: string, $return: T): T {
    if (Config.DEBUG && condition) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNot<T=any>(condition: boolean, msg: string, $return: T): T {
    if (Config.DEBUG && !condition) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNull<T=any>(value: any, msg: string, $return: T): T {
    if (Config.DEBUG && value === null) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfUndefined<T=any>(value: any, msg: string, $return: T): T {
    if (Config.DEBUG && value === undefined) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNullOrUndefined<T=any>(value: any, msg: string, $return: T): T {
    if (Config.DEBUG && (value === null || value === undefined)) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotString<T=any>(value: any, msg: string, $return: T): T {
    if (Config.DEBUG && typeof value !== 'string') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotNumber<T=any>(value: any, msg: string, $return: T): T {
    if (Config.DEBUG && typeof value !== 'number') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotBoolean<T=any>(value: any, msg: string, $return: T): T {
    if (Config.DEBUG && typeof value !== 'boolean') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotArray<T=any>(value: any, msg: string, $return: T): T {
    if (Config.DEBUG && !Array.isArray(value)) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotObject<T=any>(value: any, msg: string, $return: T): T {
    if (Config.DEBUG && typeof value !== 'object') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotFunction<T=any>(value: any, msg: string, $return: T): T {
    if (Config.DEBUG && typeof value !== 'function') {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotRegExp<T=any>(value: any, msg: string, $return: T): T {
    if (Config.DEBUG && !(value instanceof RegExp)) {
      throw new Error(msg);
    }
    return $return;
  }
  protected dieIfNotDate<T=any>(value: any, msg: string, $return: T): T {
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
  abstract withType(type: string): any;
  /** [ **REQUIRED** ] Form item must have a name. @returns this. */
  abstract withName(name: string): any;
}