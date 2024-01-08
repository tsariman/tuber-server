import { TStateForm, TStateFormItem } from '../common.types';
import AbstractStateBuilder from './abstract.state.builder';
import FormItemStateBuilder from './form.item.state.builder';

export default class FormStateBuilder extends AbstractStateBuilder {
  private _items: TStateFormItem[];
  constructor(private _state: TStateForm = {}) {
    super();
    this._items = [];
  }
  build(): TStateForm {
    if (this._items.length > 0) {
      this._state.items = this._items;
    }
    return this._state;
  }
  add(instance: FormItemStateBuilder): this {
    this._items.push(instance.build());
    return this;
  }
  with_Id(_id: string): this {
    this._state._id = _id;
    return this;
  }
  with_Key(_key: string): this {
    this._state._key = _key;
    return this;
  }
}