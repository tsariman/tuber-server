import AbstractStateBuilder, {
  AbstractFormItemStateBuilder,
  TTextField
} from './abstract.state.builder';
import {
  TStateFormItem,
  TStateFormItemType
} from '../../shared';

type TType = TStateFormItem['_type'];

export default class FormItemBaseStateBuilder extends AbstractFormItemStateBuilder {
  constructor(
    protected readonly $state: TStateFormItem = {},
  ) {
    super();
  }
  /**
   * Set the form item id.
   * @param _id 
   * @returns this.
   */
  withId(_id: string): this {
    this.$state._id = _id;
    return this;
  }
  /**
   * Set a unique key for the form item.
   * @param _key 
   * @returns this.
   */
  withKey(_key: string): this {
    this.$state._key = _key;
    return this;
  }
  /**
   * Machine-readable type of the form item.
   * @param _type 
   * @returns this.
   */
  with_Type(_type: TType): this {
    this.$state._type = _type;
    return this;
  }
  withType(type: TStateFormItemType): this {
    this.$state.type = type;
    return this;
  }
  /**
   * [ **REQUIRED** ] Set the form item machine name.
   * @param name 
   * @returns this.
   */
  withName(name: string): this {
    this.$state.name = name;
    return this;
  }
  /**
   * Set human-readable label for the form item.
   * @param text 
   * @param field [ *optional* ] state field to set the text to.
   * @returns this.
   */
  withText(text: string, field?: TTextField): this {
    this.$state.has = this.$state.has || {};
    switch (field) {
    case 'label':
      this.$state.label = text;
      break;
    case 'title':
      this.$state.has.title = text;
      break;
    case 'has_label':
    default:
      this.$state.has.label = text;
      break;
    }
    return this;
  }
  protected missing_form_name(): never {
    throw new Error('Call configure() first to define the formName and field name.');
  }
  withBootstrapState(): never { return this.bootstrap_not_available(); }
  /** Get the state. @returns state. */
  build(): TStateFormItem { return this.$state; }
  configure(): this { return this; }
  buildResponse(): never { return this.response_not_defined(); }
  /**
   * **DO NOT USE.** Base class method not implemented.
   * @returns this.
   */
  add(_i: AbstractStateBuilder): this {
    return this.die('Method not implemented.', this);
  }
}
