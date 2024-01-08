import FormItemBaseStateBuilder from './form.item.base.state.builder';
import { TStateFormItem, TStateFormItemSwitchToggle } from '../common.types';
import FormItemSwitchToggleStateBuilder from './form.item.switch.toggle.state.builder';

export default class FormItemSwitchStateBuilder
  extends FormItemBaseStateBuilder
{
  private _items: TStateFormItemSwitchToggle[];
  constructor(state: TStateFormItem = {}) {
    super(state);
    this.$state.type = 'switch';
    this._items = [];
  }
  /** Not needed for a switch instance. @returns this. */
  withType(): this { return this.die('Method not implemented.', this); }
  withLabel(label: string): this {
    this.$state.label = label;
    return this;
  }
  /**
   * Set the switch form control component props.
   * @param props 
   * @returns this.
   */
  hasFormControlProps(props: Record<string, any>): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.formControlProps = props;
    return this;
  }
  /**
   * Set the switch form label component props.
   * @param props 
   * @returns this.
   */
  hasFormLabelProps(props: Record<string, any>): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.formLabelProps = props;
    return this;
  }
  /**
   * Set the switch form group component props.
   * @param props 
   * @returns this.
   */
  hasFormGroupProps(props: Record<string, any>): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.formHelperTextProps = props;
    return this;
  }
  /**
   * Add a new switch toggle.
   * @param instance 
   * @returns this.
   */
  add(instance: FormItemSwitchToggleStateBuilder): this {
    this._items.push(instance.build());
    return this;
  }
  /**
   * Set the switch form control label component props.
   * @param props 
   * @returns this.
   */
  hasFormControlLabelProps(props: Record<string, any>): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.formControlLabelProps = props;
    return this;
  }
  /**
   * Set this switch component props.
   * @param props 
   * @returns this.
   */
  withProps(props: Record<string, any>): this {
    this.$state.props = props;
    return this;
  }
}