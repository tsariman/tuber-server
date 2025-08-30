import { TJsonapiStateResponse, TStateFormItemCustom } from '../../shared';
import AbstractStateBuilder from './abstract.state.builder';

type TSvgIconProps = TStateFormItemCustom['svgIconProps'];
type TIconProps = TStateFormItemCustom['iconProps'];

export default class FormItemCustomStateBuilder<T=unknown> extends AbstractStateBuilder {
  private _items: T[];
  constructor(private readonly _state: TStateFormItemCustom<T> = {}) {
    super();
    this._items = [];
  }
  /** Get the state. @returns state. */
  build() {
    if (this._items.length > 0) {
      this._state.items = this._items;
    }
    return this._state;
  }
  /**
   * Add a new item to the custom form item.
   * @param element 
   * @returns this.
   */
  add(element: T): this {
    this._items.push(element);
    return this;
  }
  /** **DO NOT USE**. Method is NOT implemented. @returns this. */
  withId() { return this.die('Method not implemented.', this); }
  /** **DO NOT USE**. Method is NOT implemented. @returns this. */
  withKey() { return this.die('Method not implemented.', this); }
  /**
   * Set an icon for the custom form item.
   * @param icon 
   * @returns this.
   */
  withIcon(icon: string): this {
    this._state.icon = icon;
    return this;
  }
  /**
   * Set a font-awesome icon for the custom form item.
   * @param props 
   * @returns this.
   */
  withFaIcon(faIcon: string): this {
    this._state.faIcon = faIcon;
    return this;
  }

  withIconProps(iconProps: TIconProps): this {
    this._state.iconProps = iconProps;
    return this;
  }

  /**
   * Set the icon component props for the custom form item.
   * @param props 
   * @returns this.
   */
  withSvgIconProps(svgIconProps: TSvgIconProps): this {
    this._state.svgIconProps = svgIconProps;
    return this;
  }
  /**
   * Set the svg icon for the custom form item.
   * @param svgIcon 
   * @returns this.
   */
  withSvgIcon(svgIcon: string): this {
    this._state.svgIcon = svgIcon;
    return this;
  }
  /**
   * Set the label for the custom form item.
   * @param label 
   * @returns this.
   */
  withLabel(label: string): this {
    this._state.label = label;
    return this;
  }
  configure(): this { return this; }
  withBootstrapState(): never { return this.bootstrap_not_available(); }
  buildResponse(): TJsonapiStateResponse { return {'state': {}}; }
}