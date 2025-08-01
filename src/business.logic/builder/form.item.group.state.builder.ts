import {
  TStateFormItem,
  TStateFormItemGroup,
  TItemGroup
} from '../../common.types';
import AbstractStateBuilder from './abstract.state.builder';

export default class FormItemGroupStateBuilder
  extends AbstractStateBuilder
{
  private _items: TStateFormItem[];
  constructor(private _state: TStateFormItemGroup = {},
    private __type: TItemGroup = 'stack'
  ) {
    super();
    this._state.type = this.__type;
    this._items = [];
  }

  build(): TStateFormItemGroup {
    if (this._items.length > 0) {
      this._state.items = this._items;
    }
    return this._state;
  }
  add(instance: AbstractStateBuilder): this {
    this._items.push(instance.build() as TStateFormItem);
    return this;
  }
  addItem(item: TStateFormItem): this {
    this._items.push(item);
    return this;
  }
  with_Id(_id: string): this { return this.die('Method not implemented.', this); }
  with_Key(_key: string): this { return this.die('Method not implemented.', this); }
  /**
   * Set the form item group layout.
   * @param type 
   * @returns this.
   */
  withType(type: TItemGroup): this {
    this.__type = type;
    return this;
  }
  /**
   * Set the input component props.
   * @param props object containing the props.
   * @returns this.
   */
  withProps(props: Record<string, unknown>): this {
    this._state.props = props;
    return this;
  }
  /**
   * Set the form item group items.
   * @param items 
   * @returns this.
   */
  withItems(items: TStateFormItem[]): this {
    this._items = items;
    return this;
  }
}