import { TOptional } from 'src/utility/common.types'
import {
  IJsonapiError,
  IJsonapiErrorLinks,
  IJsonapiErrorSource
} from "../../../tuber-client/src/controllers/interfaces/IJsonapi"

export type TJsonapiError = TOptional<IJsonapiError, 'code' | 'title'>

export default class JsonapiErrorBuilder {
  private errors: TJsonapiError[]
  private index: number

  constructor() {
    this.errors = []
    this.index = 0
    this.errors.push({})
  }

  toString() {
    return { errors: this.errors }
  }
  next() {
    this.index++
    this.errors.push({})
    return this
  }
  id(val: string) {
    this.errors[this.index].id = val
    return this
  }
  link(val: IJsonapiErrorLinks) {
    this.errors[this.index].links = val
    return this
  }
  status(val: number) {
    this.errors[this.index].status = ''+val
    return this
  }
  code(val: string) {
    this.errors[this.index].code = val
    return this
  }
  title(val: string) {
    this.errors[this.index].title = val
    return this
  }
  detail(val: string) {
    this.errors[this.index].detail = val
    return this
  }
  source(val: IJsonapiErrorSource) {
    this.errors[this.index].source = val
    return this
  }
  meta(val: any) {
    this.errors[this.index].meta = val
    return this
  }
  build() {
    return this.errors
  }
}