import { TOptional } from 'src/utility/common.types'
import {
  IJsonapiError,
  IJsonapiErrorLinks,
  IJsonapiErrorResponse,
  IJsonapiErrorSource,
  IJsonapiLink
} from "../../../tuber-client/src/controllers/interfaces/IJsonapi"

export type TJsonapiError = TOptional<IJsonapiError, 'code' | 'title'>

const errorSkeleton: IJsonapiError = {
  code: '',
  title: '',
}

export default class JsonapiErrorBuilder {
  private response: IJsonapiErrorResponse
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
  setLink(key: string, val: string) {
    this.response.links = this.response.links || { self: '' }
    this.response.links[key] = val
    return this
  }
  hrefLink(key: string, href: string, meta?: any) {
    this.response.links = this.response.links || { self: '' }
    const link: IJsonapiLink = { href, meta }
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
  link(val: IJsonapiErrorLinks) {
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
  detail(val: string) {
    this.response.errors[this.index].detail = val
    return this
  }
  source(val: IJsonapiErrorSource) {
    this.response.errors[this.index].source = val
    return this
  }
  build() {
    return this.response
  }
}