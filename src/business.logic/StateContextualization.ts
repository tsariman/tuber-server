import { is_record, resolve } from '../utility'
import { errr } from '../utility/logging'

export default class StateContextualization<T> {
  private _state: T
  private _path: string
  constructor(state: T, path = '') {
    this._state = state
    this._path = path
  }
  apply(handler: (parent: unknown, value: unknown) => void) {
    const { parent, value } = resolve(this._state, this._path)
    if (is_record(parent) && typeof value !== 'undefined') {
      handler(parent, value)
    } else {
      errr(`StateContextualization: Failed to apply handler at path "${this._path}". Parent or value is invalid.`, { parent, value })
    }
  }
}