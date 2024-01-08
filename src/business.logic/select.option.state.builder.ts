import { TStateFormItemSelectOption } from 'src/common.types';
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
  with_Id() {
    return this.die('Method not implemented.', this);
  }
  /**
   * **DO NOT USE**. Method is NOT implemented.
   * @returns this.
   */
  with_Key() {
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
}