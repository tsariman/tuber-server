import { TFormChoices, TStateFormItemCustom } from '@tuber/shared'
import FormItemBaseStateBuilder from './FormItemBaseStateBuilder'

type TFormControlProps = TStateFormItemCustom['formControlProps']
type TFormLabelProps = TStateFormItemCustom['formLabelProps']
type TProps = TFormChoices['props']

export default class FormChoicesStateBuilder<T=unknown> extends FormItemBaseStateBuilder {
  constructor(
    private readonly _state: TFormChoices = {},
  ) {
    super(_state)
    this._state = {}
  }
  /**
   * Set the form control component props
   * @param props
   * @returns this.
   */
  hasFormControlProps(props: TFormControlProps): this {
    this._state.has ??= {}
    this._state.has.formControlProps = props
    return this
  }
  /**
   * Set the form label component props
   * @param props 
   * @returns this.
   */
  hasFormLabelProps(props: TFormLabelProps): this {
    this._state.has ??= {}
    this._state.has.formLabelProps = props
    return this
  }
  /**
   * Set the component props
   * @param props 
   * @returns this.
   */
  withProps(props: TProps): this {
    this._state.props = props
    return this
  }
  /**
   * Set the callback to run on change event.
   * @param handler function name.
   * @returns this.
   */
  hasOnchangeHandler(handler: string): this {
    this._state.has ??= {}
    this._state.has.onchangeHandler = handler
    return this
  }
  /**
   * Set an array of items. What for? I don't know. T_T
   * @param items
   * @returns this.
   */
  hasItems(items: T[]): this {
    this._state.has ??= {}
    this._state.has.items = items
    return this
  }
}