import AbstractStateBuilder from './AbstractStateBuilder';
import {
  TJsonapiStateResponse,
  TStateFormItemSwitchToggle
} from '@tuber/shared';
import { FormControlLabelProps } from '@mui/material';

export default class FormItemSwitchToggleStateBuilder
  extends AbstractStateBuilder
{
  constructor(
    private readonly _state: TStateFormItemSwitchToggle = {},
  ) {
    super();
  }
  /** **DO NOT USE!** Not implemented. @returns this. */
  add() { return this.die('Method not implemented.', this); }
  /** **DO NOT USE!** Not implemented. @returns this. */
  with_Id() { return this.die('Method not implemented.', this); }
  /** **DO NOT USE!** Not implemented. @returns this. */
  with_Key() { return this.die('Method not implemented.', this); }
  /**
   * Set the toggle label.
   * @param label 
   * @returns 
   */
  withLabel(label: string): this {
    this._state.label = label;
    return this;
  }
  /**
   * Set the toggle name.
   * @param name
   * @returns this.
   */
  withName(name: string): this {
    this._state.name = name;
    return this;
  }
  /**
   * Set the toggle form control label props.
   * @param value 
   * @returns this.
   */
  withFormControlLabelProps(props: FormControlLabelProps): this {
    this._state.formControlLabelProps = props;
    return this;
  }
  /** Get the state. @returns state. */
  build(): TStateFormItemSwitchToggle { return this._state; }
  configure(): this { return this; }
  withBootstrapState(): never { return this.bootstrapNotAvailable(); }
  buildResponse(): TJsonapiStateResponse { return {'state': {}}; }
}