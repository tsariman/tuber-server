import { AbstractFormItemStateBuilder } from './AbstractStateBuilder';
import { TJsonapiStateResponse, TStateFormItemCheckboxBox } from '../../shared';
import IFormChoices from '../../shared/interfaces/IFormChoices';

export default class FormItemBoxStateBuilder extends AbstractFormItemStateBuilder {
  constructor(private readonly _state: TStateFormItemCheckboxBox = {}) {
    super();
  }
  build(): TStateFormItemCheckboxBox {
    return this._state;
  }
  /** Method not implemented. @returns this. */
  add(): this { return this.die('Method not implemented.', this); }
  with_Id(_id: string) { return this.die('Method not implemented.', this); }
  with_Key(_key: string) { return this.die('Method not implemented.', this); }
  /** Method not implemented. @returns this. */
  withType() { return this.die('Method not implemented.', this); }
  withName(name: string): this {
    this._state.name = name;
    return this;
  }
  /**
   * Set the checkbox label.
   * @param text Human-readable label.
   * @returns this.
   */
  withLabel(text: string): this {
    this._state.label = text;
    return this;
  }
  /**
   * Set the checkbox color.
   * @param color
   * @returns this.
   */
  withColor(color: IFormChoices['color']): this {
    this._state.color = color;
    return this;
  }
  /**
   * Set the checkbox to be disabled.
   * @returns this.
   */
  isDisabled(): this {
    this._state.disabled = true;
    return this;
  }
  /**
   * Set the checkbox to be enabled.
   * @returns this.
   */
  isEnabled(): this {
    this._state.disabled = false;
    return this;
  }
  /**
   * Set the checkbox component props.
   * @param props 
   * @returns this.
   */
  withProps<T extends Record<string, unknown>>(props: T): this {
    this._state.props = props;
    return this;
  }
  /**
   * Set list of checkboxes.
   * @param props 
   * @returns this.
   */
  hasItems(items: unknown[]): this {
    this._state.has = this._state.has || {};
    this._state.has.items = items;
    return this;
  }
  configure(): this { return this; }
  withBootstrapState(): never { return this.bootstrapNotAvailable(); }
  buildResponse(): TJsonapiStateResponse { return {'state': {}}; }
}