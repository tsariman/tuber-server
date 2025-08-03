import AbstractStateBuilder from './abstract.state.builder';
import { TJsonapiStateResponse, TStateFormItemSwitchToggle } from '../../shared';
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
  withId() { return this.die('Method not implemented.', this); }
  /** **DO NOT USE!** Not implemented. @returns this. */
  withKey() { return this.die('Method not implemented.', this); }
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
  withBootstrapState(): this { return this; }
  buildResponse(): TJsonapiStateResponse { return {'state': {}}; }
}