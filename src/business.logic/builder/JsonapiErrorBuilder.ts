import {
  TIJsonapiError,
  TJsonapiErrorLinks,
  TJsonapiErrorResponse,
  TJsonapiErrorSource,
  TJsonapiLink,
  TNetState,
  TJsonapiMeta,
  TJsonapiErrorCode,
  TJsonapiErrorStatus
} from '@tuber/shared';
import { TOptional } from '../../common.types';
import { signInDialogState } from 'src/state/dialog';

export type TJsonapiError = TOptional<TIJsonapiError, 'code' | 'title'>;

const errorSkeleton: TIJsonapiError = {
  code: 'NOT_IMPLEMENTED',
  title: '',
};

export default class JsonapiErrorBuilder {
  private _response: TJsonapiErrorResponse;
  private _index: number;

  constructor() {
    this._response = { errors: [] };
    this._index = 0;
    this._response.errors.push({
      ...errorSkeleton
    });
  }
  /**
   * Insert arbitrary value into the meta member of the response object.
   * @param key name of the property
   * @param val value of the property
   * @returns `this`
   */
  withMeta<T=unknown>(key: string, val: T) {
    if (!val) return this;
    this._response.meta = this._response.meta || {};
    this._response.meta[key] = val;
    return this;
  }
  /** @deprecated */
  meta = this.withMeta;
  /**
   * Include arbitrary values in the meta property of the current error object.
   * @param key name of the property 
   * @param val value of the property
   * @returns `this`
   */
  withErrorMeta<T=unknown>(key: string, val: T) {
    if (!val) return this;
    const meta = this._response.errors[this._index].meta ?? {};
    meta[key] = val;
    this._response.errors[this._index].meta = meta;
    return this;
  }
  /** @deprecated */
  errorMeta = this.withErrorMeta;
  /**
   * Set the top level `links` property of the response object.
   * @param key name of the property
   * @param val value of the property
   * @returns `this`
   */
  setLink(key: string, val?: string) {
    if (!val) return this;
    this._response.links = this._response.links || { self: '' };
    this._response.links[key] = val;
    return this;
  }
  /**
   * Add or edit a link in the top level `links` property of the response
   * object.
   * @param key link property name
   * @param href url of the link
   * @param meta optional meta data
   * @returns `this`
   */
  hrefLink(key: string, href: string, meta?: TJsonapiMeta) {
    this._response.links = this._response.links ?? { self: '' };
    const link: TJsonapiLink = { href, meta };
    this._response.links[key] = link;
    return this;
  }
  toString() {
    return JSON.stringify(this._response, null, 2);
  }
  /** Advance the cursor to the next error object. */
  next() {
    this._index++;
    this._response.errors.push({
      ...errorSkeleton
    });
    return this;
  }
  /**
   * Set the `id` property of the current error object.
   * @param val value of the `id` property
   * @returns `this`
   */
  withId(val?: string) {
    if (!val) return this;
    this._response.errors[this._index].id = val;
    return this;
  }
  /** @deprecated */
  id = this.withId;
  /**
   * Set the `links` property of the current error object.
   * @param val value of the `links` property
   * @returns `this`
   */
  withLink(val?: TJsonapiErrorLinks) {
    if (!val) return this;
    this._response.errors[this._index].links = val;
    return this;
  }
  /** @deprecated */
  link = this.withLink;
  /**
   * Set the `status` property of the current error object.
   * @param val value of the `status` property
   * @returns `this`
   */
  withStatus(val: unknown) {
    if (!val) return this;
    if (typeof val === 'string') {
      this._response.errors[this._index].status = val as TJsonapiErrorStatus;
    } else if (typeof val === 'number') {
      this._response.errors[this._index].status = ''+val as TJsonapiErrorStatus;
    }
    return this;
  }
  /** @deprecated */
  status = this.withStatus;
  /**
   * Set the `code` property of the current error object.
   * @param val value of the `code` property
   * @returns `this`
   */
  withCode(val?: TJsonapiErrorCode) {
    if (!val) return this;
    this._response.errors[this._index].code = val;
    return this;
  }
  /** @deprecated */
  code = this.withCode;
  /**
   * Set the `title` property of the current error object.
   * @param val value of the `title` property
   * @returns `this`
   */
  withTitle(val?: string) {
    if (!val) return this;
    this._response.errors[this._index].title = val;
    return this;
  }
  /** @deprecated */
  title = this.withTitle;
  /**
   * Set the `detail` property of the current error object.
   * @param val value of the `detail` property
   * @returns `this`
   */
  withDetail(val?: string) {
    if (!val) return this;
    this._response.errors[this._index].detail = val;
    return this;
  }
  /** @deprecated */
  detail = this.withDetail;
  /**
   * Set the `source` property of the current error object.
   * @param val value of the `source` property
   * @returns `this`
   */
  withSource(val?: TJsonapiErrorSource) {
    this._response.errors[this._index].source = val;
    return this;
  }
  /** @deprecated */
  source = this.withSource;
  build() {
    return this._response;
  }
  withState(state: TNetState) {
    this._response.state = state;
    return this;
  }
}

/**
 * Default 500 error response to help prevent repetitive code.
 *
 * @param e error object from try/catch
 * @returns `TJsonapiErrorResponse`
 */
export const default_500_error_response = (e: unknown) => {
  return new JsonapiErrorBuilder()
    .withStatus(500)
    .withCode('INTERNAL_ERROR')
    .withTitle((e as Error).message)
    .withDetail((e as Error).stack)
    .build();
}

/**
 * Default 404 error response to help prevent repetitive code.
 *
 * @param error custom error object
 * @returns `TJsonapiErrorResponse`
 */
export const default_404_error_response = (
  error: { title: string, detail?: string, source?: TJsonapiErrorSource }
) => {
  return new JsonapiErrorBuilder()
    .withStatus(404)
    .withCode('RESOURCE_NOT_FOUND')
    .withTitle(error.title)
    .withDetail(error.detail)
    .withSource(error.source)
    .build();
}

/** Default 401 error response to help prevent repetitive code. */
export const default_401_error_response = (error: TJsonapiError) => {
  const { title, detail } = error;
  return new JsonapiErrorBuilder()
    .withStatus(401)
    .withCode('AUTHENTICATION_REQUIRED')
    .withTitle(title)
    .withDetail(detail)
    .withState({ 'dialog': signInDialogState })
    .build();
}

/**
 * Default 400 error response to help prevent repetitive code.
 *
 * @param error custom error object
 * @returns `TJsonapiErrorResponse`
 */
export const default_400_error_response = (
  error: { title: string, detail?: string }
) => {
  return new JsonapiErrorBuilder()
    .withStatus(400)
    .withCode('INVALID_FORMAT')
    .withTitle(error.title)
    .withDetail(error.detail)
    .build();
}

