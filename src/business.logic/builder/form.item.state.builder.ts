import {
  FormControlProps,
  FormHelperTextProps,
  InputLabelProps
} from '@mui/material';
import { TJsonapiStateResponse, TStateFormItem } from '../../shared';
import AbstractStateBuilder, { TTextField } from './abstract.state.builder';

type TType = TStateFormItem['type'];

export default class FormItemStateBuilder extends AbstractStateBuilder {
  protected $items: TStateFormItem[];
  constructor(protected $state: TStateFormItem = {}) {
    super();
    this.$items = [];
  }
  build(): TStateFormItem {
    if (this.$items.length > 0) {
      this.$state.items = this.$items;
    }
    return this.$state;
  }
  /**
   * Add a new item to the field.
   * @param instance 
   * @returns this.
   */
  add(instance: FormItemStateBuilder): this {
    this.$items.push(instance.build());
    return this;
  }
  /**
   * Set a unique id for the form item.
   * @param _id 
   * @returns this.
   */
  with_Id(_id: string): this {
    this.$state._id = _id;
    return this;
  }
  /**
   * Set a unique key for the form item.
   * @param _key 
   * @returns this.
   */
  with_Key(_key: string): this {
    this.$state._key = _key;
    return this;
  }
  /**
   * Set the type of the form item.
   * @param type 
   * @returns this.
   */
  withType(type: TType): this {
    this.$state._type = type;
    return this;
  }
  /**
   * Set the label for the form item.
   * @param label 
   * @returns this.
   */
  withLabel(label: string): this {
    this.$state.label = label;
    return this;
  }
  /**
   * Set the human-readable text for the form item.
   * @param text 
   * @param field choose which field to set the text to.
   * @returns this.
   */
  withText(text: string, field: TTextField = 'label'): this {
    this.$state.has = this.$state.has || {};
    switch (field) {
    case 'label':
      this.$state.label = text;
      break;
    case 'has_label':
      this.$state.has.label = text;
      break;
    case 'title':
      this.$state.has.title = text;
      break;
    default:
      this.$state.has.label = text;
      break;
    }
    return this;
  }
  /**
   * Set the form item's component props.
   * @param name 
   * @returns this.
   */
  withProps<T extends Record<string, unknown>>(props: T): this {
    this.$state.props = props;
    return this;
  }
  /**
   * Set the form item's href via the custom state.
   * @param href
   * @returns this.
   */
  withPropsHref(href: string) {
    this.$state.props = this.$state.props ?? {};
    this.$state.props.href = href;
    return this;
  }
  /**
   * Not possible to set event callback from server.
   * @returns this.
   */
  withOnclick(): this {
    return this.die('withOnclick() not implemented yet.', this);
  }
  /**
   * Not possible to set event callback from server.
   * @returns this.
   */
  withOnchange(): this {
    return this.die('withOnchange() not implemented yet.', this);
  }
  /**
   * Not possible to set event callback from server.
   * @param callback 
   * @returns 
   */
  hasCallback(): this {
    return this.die('hasCallback() not implemented yet.', this);
  }
  /**
   * Set an icon via the custom state.
   * @param icon
   * @returns this.
   */
  hasIcon(icon: string): this {
    this.$state.has ??= {};
    this.$state.has.icon = icon;
    return this;
  }
  /**
   * Set a font-awesome icon via the custom state.
   * @param faIcon 
   * @returns this.
   */
  hasFaIcon(faIcon: string): this {
    this.$state.has ??= {};
    this.$state.has.faIcon = faIcon;
    return this;
  }
  /**
   * Needed for: [ **select** ].  
   * @param value 
   * @returns this.
   */
  hasFormControlProps(props: FormControlProps): this {
    this.$state.has ??= {};
    this.$state.has.formControlProps = props;
    return this;
  }
  /**
   * Needed for: [ **select** ].  
   * @param props 
   * @returns this.
   */
  hasInputLabelProps(props: InputLabelProps): this {
    this.$state.has ??= {};
    this.$state.has.inputLabelProps = props;
    return this;
  }
  /**
   * Needed for: [ **select** ].  
   * @param items 
   * @see SelectOptionStateBuilder for a select form item.
   * @returns this.
   */
  hasItems(items: AbstractStateBuilder[]): this {
    this.$state.has ??= {};
    this.$state.has.items = items.map(item => item.build());
    return this;
  }
  /**
   * Needed for: [ **select** ].
   * @param helperText 
   * @returns this.
   */
  hasHelperText(helperText: string): this {
    this.$state.has ??= {};
    this.$state.has.helperText = helperText;
    return this;
  }
  /**
   * Needed for: [ **select** ].
   * @param props 
   * @returns this.
   */
  hasFormHelperTextProps(props: FormHelperTextProps): this {
    this.$state.has ??= {};
    this.$state.has.formHelperTextProps = props;
    return this;
  }
  configure(): this { return this; }
  withBootstrapState(): never { return this.bootstrapNotAvailable(); }
  buildResponse(): TJsonapiStateResponse { return {'state': {}}; }
}