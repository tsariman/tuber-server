import {
  TIJsonapiError,
  TJsonapiErrorLinks,
  TJsonapiErrorResponse,
  TJsonapiErrorSource,
  TJsonapiLink,
  TOptional
} from '../common.types'

export type TJsonapiError = TOptional<TIJsonapiError, 'code' | 'title'>

const errorSkeleton: TIJsonapiError = {
  code: '',
  title: '',
}

export default class JsonapiErrorBuilder {
  private response: TJsonapiErrorResponse
  private index: number

  constructor() {
    this.response = { errors: [] }
    this.index = 0
    this.response.errors.push({
      ...errorSkeleton
    })
  }

  meta(key: string, val: any) {
    this.response.meta = this.response.meta || {}
    this.response.meta[key] = val
    return this
  }
  errorMeta(key: string, val: any) {
    const meta = this.response.errors[this.index].meta || {}
    meta[key] = val
    this.response.errors[this.index].meta = meta
    return this
  }
  setLink(key: string, val: string) {
    this.response.links = this.response.links || { self: '' }
    this.response.links[key] = val
    return this
  }
  hrefLink(key: string, href: string, meta?: any) {
    this.response.links = this.response.links || { self: '' }
    const link: TJsonapiLink = { href, meta }
    this.response.links[key] = link
    return this
  }
  toString() {
    return this.response
  }
  next() {
    this.index++
    this.response.errors.push({
      ...errorSkeleton
    })
    return this
  }
  id(val: string) {
    this.response.errors[this.index].id = val
    return this
  }
  link(val: TJsonapiErrorLinks) {
    this.response.errors[this.index].links = val
    return this
  }
  status(val: number) {
    this.response.errors[this.index].status = ''+val
    return this
  }
  code(val: string) {
    this.response.errors[this.index].code = val
    return this
  }
  title(val: string) {
    this.response.errors[this.index].title = val
    return this
  }
  detail(val?: string) {
    if (!val) return this
    this.response.errors[this.index].detail = val
    return this
  }
  source(val: TJsonapiErrorSource) {
    this.response.errors[this.index].source = val
    return this
  }
  build() {
    return this.response
  }
}

/**
 * Default 500 error response to help prevent repetitive code.
 *
 * @param e error object from try/catch
 * @returns `TJsonapiErrorResponse`
 */
export const default_500_error_response = (e: any) => {
  return new JsonapiErrorBuilder()
    .status(500)
    .code('internal_server_error')
    .title(e.message)
    .detail(e.stack)
    .build()
}

/**
 * Default 404 error response to help prevent repetitive code.
 *
 * @param error custom error object
 * @returns `TJsonapiErrorResponse`
 */
export const default_404_error_response = (
  error: { title: string, detail?: string }
) => {
  return new JsonapiErrorBuilder()
    .status(404)
    .code('not_found')
    .title(error.title)
    .detail(error.detail)
    .build()
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
    .status(400)
    .code('bad_request')
    .title(error.title)
    .detail(error.detail)
    .build()
}