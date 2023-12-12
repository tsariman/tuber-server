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
  withMeta(key: string, val: any) {
    this.response.meta = this.response.meta || {}
    this.response.meta[key] = val
    return this
  }
  meta = this.withMeta
  withErrorMeta(key: string, val: any) {
    const meta = this.response.errors[this.index].meta || {}
    meta[key] = val
    this.response.errors[this.index].meta = meta
    return this
  }
  errorMeta = this.withErrorMeta
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
  withId(val: string) {
    this.response.errors[this.index].id = val
    return this
  }
  id = this.withId
  withLink(val: TJsonapiErrorLinks) {
    this.response.errors[this.index].links = val
    return this
  }
  link = this.withLink
  withStatus(val: number) {
    this.response.errors[this.index].status = val.toString()
    return this
  }
  status = this.withStatus
  withCode(val: string) {
    this.response.errors[this.index].code = val
    return this
  }
  code = this.withCode
  withTitle(val: string) {
    this.response.errors[this.index].title = val
    return this
  }
  title = this.withTitle
  withDetail(val?: string) {
    if (!val) return this
    this.response.errors[this.index].detail = val
    return this
  }
  detail = this.withDetail
  withSource(val?: TJsonapiErrorSource) {
    this.response.errors[this.index].source = val
    return this
  }
  source = this.withSource
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
  error: { title: string, detail?: string, source?: TJsonapiErrorSource }
) => {
  return new JsonapiErrorBuilder()
    .status(404)
    .code('not_found')
    .title(error.title)
    .detail(error.detail)
    .source(error.source)
    .build()
}

/**
 * Default 401 error response to help prevent repetitive and overinflated code.
 *
 * @param title of the error message
 * @param detail of the error message
 * @returns `TJsonapiErrorResponse`
 */
export const default_401_error_response = (
  error: {title: string, detail?: string}
) => {
  const { title, detail } = error
  return new JsonapiErrorBuilder()
    .withStatus(401)
    .withCode('unauthorized')
    .withTitle(title)
    .withDetail(detail)
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

