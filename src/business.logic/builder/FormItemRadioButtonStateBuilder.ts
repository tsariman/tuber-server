import { AbstractFormItemStateBuilder } from './AbstractStateBuilder'
import {
  TJsonapiStateResponse,
  TStateFormItemRadioButton,
  TStateFormItemCustomColor,
  TFormChoices,
  TFormControlLabelProps
} from '@tuber/shared'

export default class FormItemRadioButtonStateBuilder
  extends AbstractFormItemStateBuilder
{
  constructor(private readonly _state: TStateFormItemRadioButton = {}) {
    super()
  }
  /** **DO NOT USE.** Not implemented. @return this. */
  add() { return this.die('Method not implemented.', this) }
  /** Get the state. @returns state. */
  build() {
    return this._state
  }
  /**
   * Set a unique id for the radio button.
   * @param _id
   * @returns this.
   */
  with_Id(_id: string): this {
    this._state._id = _id
    return this
  }
  /**
   * Set a unique key for the radio button.
   * @param _key 
   * @returns this.
   */
  with_Key(_key: string): this {
    this._state._key = _key
    return this
  }
  /** Method not implemented. @returns this. */
  withType() { throw new Error('Method not implemented.') }
  /**
   * [ **REQUIRED** ] The name of the form item.
   * @param name 
   * @returns this.
   */
  withName(name: string): this {
    this._state.name = name
    return this
  }
  /**
   * [ **REQUIRED** ] The label of the form item.
   * @param label 
   * @returns this.
   */
  withLabel(label: string): this {
    this._state.label = label
    return this
  }
  /**
   * Set the color of the radio button.
   * @param color 
   * @returns this.
   */
  withColor(color: TFormChoices['color']): this {
    this._state.color = color
    return this
  }
  /**
   * Set the radio button to be disabled.
   * @returns this.
   */
  isDisabled(): this {
    this._state.disabled = true
    return this
  }
  /**
   * Set the radio button to be enabled.
   * @returns this.
   */
  isEnabled(): this {
    this._state.disabled = false
    return this
  }
  /**
   * Set the radio button component props.
   * @param props 
   * @returns this.
   */
  withProps<T extends Record<string, unknown>>(props: T): this {
    this._state.props = props
    return this
  }
  /**
   * Set the radio group form control label props.
   * @param props 
   * @returns this.
   */
  hasFormControlLabelProps(props: TFormControlLabelProps): this {
    this._state.has ??= {}
    this._state.has.formControlLabelProps = props
    return this
  }
  /**
   * Set the color of radio button via the form item's custom state.
   * @param props 
   * @returns this.
   */
  hasColor(color: TStateFormItemCustomColor): this {
    this._state.has ??= {}
    this._state.has.color = color
    return this
  }
  configure(): this { return this }
  withBootstrapState(): never { return this.bootstrapNotAvailable() }
  buildResponse(): TJsonapiStateResponse { return {'state': {}} }
}