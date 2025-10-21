import { FormControlProps, FormLabelProps } from '@mui/material';
import { TStateFormItem, TStateFormItemRadioButton } from '../../shared';
import FormItemRadioButtonStateBuilder from './FormItemRadioButtonStateBuilder';
import FormItemBaseStateBuilder from './FormItemBaseStateBuilder';

export default class FormItemRadioStateBuilder
  extends FormItemBaseStateBuilder
{
  private _items: TStateFormItemRadioButton[];
  constructor(state: TStateFormItem = {}) {
    super(state);
    this.$state.type = 'radio_buttons';
    this._items = [];
  }
  /**
   * Add a new radio button.
   * @param instance 
   * @returns this.
   */
  add(instance: FormItemRadioButtonStateBuilder): this {
    this._items.push(instance.build());
    return this;
  }
  build(): TStateFormItem {
    if (this._items.length > 0) {
      this.$state.has ??= {};
      this.$state.has.items = this._items;
    }
    return this.$state;
  }
  /** Method not implemented. @returns this. */
  withType(): this { return this.die('Method not implemented.', this); }
  /**
   * [ **REQUIRED** ] The value of the form item.
   * @param value 
   * @returns this.
   */
  withValue(value: string): this {
    this.$state.value = value;
    return this;
  }
  /**
   * [ **REQUIRED** ] The label of the form item.
   * @param label 
   * @returns this.
   */
  withLabel(label: string): this {
    this.$state.label = label;
    return this;
  }
  /**
   * Set the form control component props for the radio group.
   * @param props object with props.
   * @returns this.
   */
  hasFormControlProps(props: FormControlProps): this {
    this.$state.has ??= {};
    this.$state.has.formControlProps = props;
    return this;
  }
  /**
   * Set the form label component props for the radio group.
   * @param props 
   * @returns this.
   */
  hasFormLabelProps(props: FormLabelProps): this {
    this.$state.has ??= {};
    this.$state.has.formLabelProps = props;
    return this;
  }
  /**
   * Set the component props for the radio group.
   * @param props object with props.
   * @returns this.
   */
  withProps<T extends Record<string, unknown>>(props: T): this {
    this.$state.props = props;
    return this;
  }
  /**
   * Set the callabck function to be called when the value of the radio group
   * changes.
   * @param handle name of the callback function.
   * @returns this.
   */
  hasOnchangeHandle(handle: string): this {
    this.$state.has ??= {};
    this.$state.has.onchangeHandle = handle;
    return this;
  }
  /**
   * Set an array of radio buttons.
   * @param items
   * @returns this.
   */
  withItems(items: TStateFormItemRadioButton[]): this {
    this.$state.has ??= {};
    this.$state.has.items = items;
    return this;
  }
}