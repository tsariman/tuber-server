import { TJsonapiStateResponse, TStateFormItemSelectOption } from '../../shared';
import AbstractStateBuilder from './abstract.state.builder';

export default class SelectOptionStateBuilder extends AbstractStateBuilder {
  constructor(private _state: TStateFormItemSelectOption = {}) {
    super();
  }
  build(): TStateFormItemSelectOption {
    return this._state;
  }
  /**
   * **DO NOT USE**. Method is NOT implemented.
   * @returns this.
   */
  add(): this {
    return this.die('Method not implemented.', this);
  }
  /**
   * **DO NOT USE**. Method is NOT implemented.
   * @returns this.
   */
  withId() {
    return this.die('Method not implemented.', this);
  }
  /**
   * **DO NOT USE**. Method is NOT implemented.
   * @returns this.
   */
  withKey() {
    return this.die('Method not implemented.', this);
  }
  withLabel(label: string) {
    this._state.label = label;
    return this;
  }
  withTitle(title: string) {
    this._state.title = title;
    return this;
  }
  withValue(value: string) {
    this._state.value = value;
    return this;
  }
  configure(): this { return this; }
  withBootstrapState(): this { return this; }
  buildResponse(): TJsonapiStateResponse { return {'state': {}}; }
}