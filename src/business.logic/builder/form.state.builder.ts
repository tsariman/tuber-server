import { PaperProps } from '@mui/material';
import { TStateForm, TStateFormItem } from '../../common.types';
import AbstractStateBuilder, {
  AbstractFormItemStateBuilder
} from './abstract.state.builder';

type TType = TStateForm['_type'];

export default class FormStateBuilder extends AbstractStateBuilder {
  private _items: TStateFormItem[];
  constructor(private _state: TStateForm = {}) {
    super();
    this._items = [];
  }
  /**
   * Get the form state.
   * @returns the form state.
   */
  build(): TStateForm {
    if (this._items.length > 0) {
      this._state.items = this._items;
    }
    return this._state;
  }
  /**
   * Add a new form item state.
   * @param instance
   * @returns this.
   */
  add(instance: AbstractFormItemStateBuilder): this {
    this._items.push(instance.build() as TStateFormItem);
    return this;
  }
  /**
   * Add a new form item state.
   * @param instance
   * @returns this.
   */
  addItem(instance: AbstractFormItemStateBuilder): this {
    return this.add(instance);
  }
  /**
   * Set a unique id for the form state.
   * @param _id 
   * @returns this.
   */
  with_Id(_id: string): this {
    this._state._id = _id;
    return this;
  }
  /**
   * Set a unique key for the form state.
   * @param _key 
   * @returns this.
   */
  with_Key(_key: string): this {
    this._state._key = _key;
    return this;
  }
  /**
   * Set the form `_type`.
   * @param _type 
   * @returns this.
   */
  with_Type(_type: TType): this {
    this._state._type = _type;
    return this;
  }
  /**
   * Set the form component props.
   * @param props object containing the form component props.
   * @returns this.
   */
  withProps(props: Record<string, unknown>): this {
    this._state.props = props;
    return this;
  }
  /**
   * Set whether the form has a paper background.
   * @returns this.
   */
  withPaperBackground(): this {
    this._state.paperBackground = true;
    return this;
  }
  /**
   * Set the form's paper background component props.
   * @param props object containing the form's paper background component
   *              props.
   * @returns this.
   */
  withPaperProps(props: PaperProps): this {
    this._state.paperProps = props;
    return this;
  }
}