import { FormControlLabelProps } from '@mui/material';
import IFormChoices from '../../shared/interfaces/IFormChoices';
import { AbstractFormItemStateBuilder } from './abstract.state.builder';
import { TJsonapiStateResponse, TStateFormItemRadioButton } from '../../shared';
import { TStateFormITemCustomColor } from '../../shared/interfaces/IStateFormItemCustom';

export default class FormItemRadioButtonStateBuilder
  extends AbstractFormItemStateBuilder
{
  constructor(private readonly _state: TStateFormItemRadioButton = {}) {
    super();
  }
  /** **DO NOT USE.** Not implemented. @return this. */
  add() { return this.die('Method not implemented.', this); }
  /** Get the state. @returns state. */
  build() {
    return this._state;
  }
  /**
   * Set a unique id for the radio button.
   * @param _id
   * @returns this.
   */
  withId(_id: string): this {
    this._state._id = _id;
    return this;
  }
  /**
   * Set a unique key for the radio button.
   * @param _key 
   * @returns this.
   */
  withKey(_key: string): this {
    this._state._key = _key;
    return this;
  }
  /** Method not implemented. @returns this. */
  withType() { throw new Error('Method not implemented.'); }
  /**
   * [ **REQUIRED** ] The name of the form item.
   * @param name 
   * @returns this.
   */
  withName(name: string): this {
    this._state.name = name;
    return this;
  }
  /**
   * [ **REQUIRED** ] The label of the form item.
   * @param label 
   * @returns this.
   */
  withLabel(label: string): this {
    this._state.label = label;
    return this;
  }
  /**
   * Set the color of the radio button.
   * @param color 
   * @returns this.
   */
  withColor(color: IFormChoices['color']): this {
    this._state.color = color;
    return this;
  }
  /**
   * Set the radio button to be disabled.
   * @returns this.
   */
  isDisabled(): this {
    this._state.disabled = true;
    return this;
  }
  /**
   * Set the radio button to be enabled.
   * @returns this.
   */
  isEnabled(): this {
    this._state.disabled = false;
    return this;
  }
  /**
   * Set the radio button component props.
   * @param props 
   * @returns this.
   */
  withProps<T extends Record<string, unknown>>(props: T): this {
    this._state.props = props;
    return this;
  }
  /**
   * Set the radio group form control label props.
   * @param props 
   * @returns this.
   */
  hasFormControlLabelProps(props: FormControlLabelProps): this {
    this._state.has ??= {};
    this._state.has.formControlLabelProps = props;
    return this;
  }
  /**
   * Set the color of radio button via the form item's custom state.
   * @param props 
   * @returns this.
   */
  hasColor(color: TStateFormITemCustomColor): this {
    this._state.has ??= {};
    this._state.has.color = color;
    return this;
  }
  configure(): this { return this; }
  withBootstrapState(): never { return this.bootstrap_not_available(); }
  buildResponse(): TJsonapiStateResponse { return {'state': {}}; }
}