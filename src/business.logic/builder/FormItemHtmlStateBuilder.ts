import FormItemBaseStateBuilder from './FormItemBaseStateBuilder';

export default class FormItemHtmlStateBuilder extends FormItemBaseStateBuilder {
  /** Method not implemented. @returns this. */
  add(): this { return this.die('Method not implemented.', this); }
  /** Method not implemented. @returns this. */
  withType() { return this.die('Method not implemented.', this); }
  /**
   * Set human-readable text via the form item's custom state.
   * @param text 
   * @returns 
   */
  hasText(text: string): this {
    this.$state.has ??= {};
    this.$state.has.text = text;
    return this;
  }
  /**
   * Set the key field in the form item's custom state.
   * @param key 
   * @returns this.
   */
  hasKey(key: string): this {
    this.$state.has ??= {};
    this.$state.has.key = key;
    return this;
  }
  /**
   * Set the route field in the form item's custom state.
   * @param route 
   * @returns this.
   */
  hasRoute(route: string): this {
    this.$state.has ??= {};
    this.$state.has.route = route;
    return this;
  }
  /**
   * Set the form item's component props.
   * @param props 
   * @returns this.
   */
  withProps<T extends Record<string, unknown>>(props: T): this {
    this.$state.props = props;
    return this;
  }
  /**
   * Set the callback function for the form item's onclick event.
   * @param handle name of the callback function.
   * @returns this.
   */
  hasOnclickHandle(handle: string): this {
    this.$state.has ??= {};
    this.$state.has.onclickHandle = handle;
    return this;
  }
  /**
   * Set the HTML content.
   * @param content 
   * @returns this.
   */
  hasContent(content: string): this {
    this.$state.has ??= {};
    this.$state.has.content = content;
    return this;
  }
}