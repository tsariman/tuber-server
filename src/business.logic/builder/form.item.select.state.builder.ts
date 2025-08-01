import {
  TStateFormItem,
  TStateFormItemSelectOption
} from 'src/common.types';
import SelectOptionStateBuilder from './select.option.state.builder';
import FormItemBaseStateBuilder from './form.item.base.state.builder';
import { FormControlProps, FormHelperTextProps, InputLabelProps } from '@mui/material';

type TType = 'state_select' | 'state_select_native';

export default class FormItemSelectStateBuilder
  extends FormItemBaseStateBuilder
{
  protected _items: TStateFormItemSelectOption[];
  constructor(state: TStateFormItem = {},
    type: TType = 'state_select'
  ) {
    super(state);
    this.$state.type = type;
    this._items = [];
  }
  /** Method not implemented. @returns this. */
  withType() { return this.die('Method not implemented.', this); }
  build(): TStateFormItem {
    if (this._items.length > 0) {
      this.$state.has = this.$state.has || {};
      this.$state.has.items = this._items;
    }
    return this.$state;
  }
  add(instance: SelectOptionStateBuilder): this {
    this._items.push(instance.build());
    return this;
  }
  /**
   * Set the form control props for the form item.
   * @param props object with props.
   * @returns this.
   */
  hasFormControlProps(props: FormControlProps): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.formControlProps = props;
    return this;
  }
  /**
   * Set the input label props for a select form item.  
   * @param props object with props.
   * @returns this.
   */
  hasInputLabelProps(props: InputLabelProps): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.inputLabelProps = props;
    return this;
  }
  withProps(props: Record<string, unknown>): this {
    this.$state.props = props;
    return this;
  }
  /**
   * Not possible to set event callback from server.  
   * Use **`hasOnchangeHandle()`** instead.
   * @returns this.
   */
  hasOnChange(): this {
    return this.die('Method not implemented.', this);
  }
  hasOnchangeHandle(handle: string): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.onchangeHandle = handle;
    return this;
  }
  /**
   * Import an array of select option instances ready to be built.  
   * @param items array of SelectOptionStateBuilder. 
   * @returns this.
   */
  hasItems(items: SelectOptionStateBuilder[]): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.items = items.map(item => item.build());
    return this;
  }
  /**
   * Select helper text.
   * @param text 
   * @returns this.
   */
  hasHelperText(text: string): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.helperText = text;
    return this;
  }
  /**
   * Set the props of the select helper text component.
   * @param props object with props.
   * @returns this.
   */
  hasFormHelperTextProps(props: FormHelperTextProps): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.formHelperTextProps = props;
    return this;
  }
}