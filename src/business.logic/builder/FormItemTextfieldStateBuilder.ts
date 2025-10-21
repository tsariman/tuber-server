import FormItemBaseStateBuilder from './FormItemBaseStateBuilder';
import {
  TJsonapiStateResponse,
  TStateFormItem,
  TStateFormItemAdornment,
  TStateFormItemCustom,
  TStateFormItemInputProps
} from '../../shared';
import AbstractStateBuilder from './AbstractStateBuilder';
import LinkStateBuilder from './LinkStateBuilder';
import { TTextProps } from '../../shared/interfaces';

type TPredefinedRegex = TStateFormItemCustom['predefinedRegex'];

export default class FormItemTextfieldStateBuilder
  extends FormItemBaseStateBuilder
{
  constructor(state: TStateFormItem = {}) {
    super(state);
    this.$state.type = 'textfield';
  }
  /** **DO NOT USE.** Not needed for a textfield instance. @returns this. */
  withType(): this { return this.die('Method not implemented.', this); }
  /**
   * Set the input label.
   * @param label Human-readable label for the input.
   */
  withLabel(label: string): this {
    this.$state.label = label;
    return this;
  }
  /**
   * Set the input component props.
   * @param props object containing the props.
   * @returns this.
   */
  withProps<T extends Record<string, unknown>>(props: T): this {
    this.$state.props = props;
    return this;
  }
  /**
   * Set the maximum length of the field.
   * @param maxLength
   * @returns this.
   */
  hasMaxLength(maxLength: number): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.maxLength = maxLength;
    return this;
  }
  /**
   * Regular expression to invalidate the field.
   * @param regex string version of the regular expression.
   * @returns this.
   */
  hasInvalidationRegex(regex: string): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.invalidationRegex = regex;
    return this;
  }
  /**
   * Regular expression to validate the field.
   * @param regex string version of the regular expression.
   * @returns this.
   */
  hasValidationRegex(regex: string): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.validationRegex = regex;
    return this;
  }
  /**
   * Make the field required.
   * @returns this.
   */
  isRequired(): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.required = true;
    return this;
  }
  /**
   * Set the required message.
   * @param message to be displayed when the field is required.
   * @returns this.
   */
  hasRequiredMessage(message: string): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.requiredMessage = message;
    return this;
  }
  /**
   * Set the maximum length message.
   * @param message to be displayed when the maximum length is exceeded.
   * @returns this.
   */
  hasMaxLenghtMessage(message: string): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.maxLengthMessage = message;
    return this;
  }
  /** [TODO] Don't use. This is not fully implemented and needs work. */
  isDisabledOnError(): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.disableOnError = true;
    return this;
  }
  /**
   * Set the message to display when the field validation fails.
   * e.g. this is a `if not` case.
   * @param message
   * @returns this.
   */
  hasInvalidationMessage(message: string): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.invalidationMessage = message;
    return this;
  }
  /**
   * Set the message to display when the field validation fails.  
   * e.g. this is a `if` case.
   * @param message
   * @returns this.
   */
  hasValidationMessage(message: string): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.validationMessage = message;
    return this;
  }
  /**
   * Set the callback function to be called when the field gains focus.
   * @param handle string name of the callback function.
   * @returns this.
   */
  hasOnfocusHandle(handle: string): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.onfocusHandle = handle;
    return this;
  }
  /**
   * Set the callback function to be called when the field value changes.
   * @param handle string name of the callback function.
   * @returns this.
   */
  hasOnchangeHandle(handle: string): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.onchangeHandle = handle;
    return this;
  }
  /**
   * Set the callback function to be called when a key is pressed.
   * @param handle string name of the callback function.
   * @returns this.
   */
  hasOnkeydownHandle(handle: string): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.onkeydownHandle = handle;
    return this;
  }
  /**
   * Set the callback function to be called when the field loses focus.
   * @param handle string name of the callback function.
   * @returns this.
   */
  hasOnblurHandle(handle: string): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.onblurHandle = handle;
    return this;
  }
  /**
   * Set the predefined regex.
   * @param str
   * @returns this.
   */
  hasRegexError(str: TPredefinedRegex): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.predefinedRegex = str;
    return this;
  }
  /**
   * Set the input helper text.
   * @param props 
   * @returns this.
   */
  hasHelperText(text: string): this {
    this.$state.has = this.$state.has || {};
    this.$state.has.helperText = text;
    return this;
  }
  /**
   * Set the form control props.
   * @param props 
   * @returns this.
   */
  withInputProps(props: TStateFormItemInputProps): this {
    this.$state.inputProps = props;
    return this;
  }
  /**
   * Set the input field to read only.
   * @param props 
   * @returns this.
   */
  isReadOnly(): this {
    this.$state.inputProps = this.$state.inputProps || {};
    (this.$state.inputProps as any).readOnly = true; // Silly hack!
    return this;
  }
}

export class FormItemInputPropsStateBuilder
  extends AbstractStateBuilder
{
  constructor(private _state: TStateFormItemInputProps = {}) {
    super();
  }
  /** Get the state. @returns state. */
  build(): TStateFormItemInputProps { return this._state; }
  /** **DO NOT USE!** Not implemented. @returns this. */
  add(): this { return this.die('Method not implemented.', this); }
  /** **DO NOT USE!** Not implemented. @returns this. */
  with_Id(_id: string): this { return this.die('Method not implemented.', this); }
  /** **DO NOT USE!** Not implemented. @returns this. */
  with_Key(_key: string): this { return this.die('Method not implemented.', this); }
  /**
   * Set the `start` input props.
   * @param props
   * @returns this.
   */
  withStart(start: FormItemAdornmentStateBuilder): this {
    this._state.start = start.build();
    return this;
  }
  /**
   * Set the `end` input props.
   * @param props
   * @returns this.
   */
  withEnd(end: FormItemAdornmentStateBuilder): this {
    this._state.end = end.build();
    return this;
  }
  configure(): this { return this; }
  withBootstrapState(): this { return this; }
  buildResponse(): TJsonapiStateResponse { return {'state': {}}; }
}

export class FormItemAdornmentStateBuilder
  extends AbstractStateBuilder
{
  constructor(private _state: TStateFormItemAdornment = {}) {
    super();
  }
  /** Get the state. @returns state. */
  build(): TStateFormItemAdornment { return this._state; }
  /** **DO NOT USE!** Not implemented. @returns this. */
  add(): unknown { return this.die('Method not implemented.', {}); }
  /** **DO NOT USE!** Not implemented. @returns this. */
  with_Id(): this { return this.die('Method not implemented.', this); }
  /** **DO NOT USE!** Not implemented. @returns this. */
  with_Key(): this { return this.die('Method not implemented.', this); }
  /**
   * Set the icon.
   * @param {LinkStateBuilder} icon 
   * @returns this.
   */
  withIcon(icon: LinkStateBuilder): this {
    this._state.icon = icon.build();
    return this;
  }
  /**
   * Set the text.  
   * **Note:** Not to be confused with the form item text.
   * @param {string} text string to display.
   * @returns this.
   */
  withText(text: string): this {
    this._state.text = text;
    return this;
  }
  /**
   * Set the position.
   * @param {string} props
   * @returns this.
   */
  withTextProps(props: TTextProps): this {
    this._state.textProps = props;
    return this;
  }
  configure(): this { return this; }
  withBootstrapState(): never { return this.bootstrapNotAvailable(); }
  buildResponse(): TJsonapiStateResponse { return {'state': {}}; }
}
