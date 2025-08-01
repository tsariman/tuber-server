import { TStateFormItem, TStateFormItemCustom } from 'src/common.types';
import FormItemBoxStateBuilder from './form.item.box.state.builder';
import FormItemBaseStateBuilder from './form.item.base.state.builder';

export default class FormItemCheckboxesStateBuilder extends FormItemBaseStateBuilder {
  private _items: TStateFormItemCustom[];

  constructor(private readonly _state: TStateFormItem = {}) {
    super(_state);
    this._state.type = 'checkboxes';
    this._items = [];
  }

  build() {
    if (this._items.length > 0) {
      this._state.has = this._state.has || {};
      this._state.has.items = this._items;
    }
    return this._state;
  }
  /**
   * Add a new checkbox.
   * @param item
   * @returns this.
   */
  add(item: FormItemBoxStateBuilder): this {
    this._items.push(item.build());
    return this;
  }
  /** **DO NOT USE.** Method not implemented. @returns this. */
  withType(): this { return this.die('Method not implemented.', this); }
  /**
   * Set the form control props for the form item.
   * @param props object with props.
   * @returns this.
   */
  hasFormControlProps(props: Record<string, unknown>): this {
    this._state.has = this._state.has || {};
    this._state.has.formControlProps = props;
    return this;
  }
  /**
   * Set the form label props for the form item.
   * @param props 
   * @returns this.
   */
  hasFormLabelProps(props: Record<string, unknown>): this {
    this._state.has = this._state.has || {};
    this._state.has.formLabelProps = props;
    return this;
  }
  /**
   * Set the form group props for the form item.
   * @param props object with props.
   * @returns this.
   */
  hasFormGroupProps(props: Record<string, unknown>): this {
    this._state.has = this._state.has || {};
    this._state.has.formGroupProps = props;
    return this;
  }
  /**
   * Set the props of the select helper text component.
   * @param props object with props.
   * @returns this.
   */
  hasFormHelperTextProps(props: Record<string, unknown>): this {
    this._state.has = this._state.has || {};
    this._state.has.formHelperTextProps = props;
    return this;
  }
  /**
   * Select helper text.
   * @param text 
   * @returns this.
   */
  hasHelperText(text: string): this {
    this._state.has = this._state.has || {};
    this._state.has.helperText = text;
    return this;
  }
}