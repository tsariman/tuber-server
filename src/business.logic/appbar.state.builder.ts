import AbstractStateBuilder from 'src/business.logic/abstract.state.builder';
import { TStateAppbar, TStateLink } from '../common.types';
import LinkStateBuilder from './link.state.builder';
import FormItemCustomStateBuilder from './form.item.custom.state.builder';

type TTypography = TStateAppbar['typography'];
type TTextLogoProps = TStateAppbar['textLogoProps'];
type TSearchFieldProps = TStateAppbar['searchFieldProps'];
type TInputBaseProps = { id?: string } & TStateAppbar['inputBaseProps'];
type TSearchFieldIconButtonProps = TStateAppbar['searchFieldIconButtonProps'];

export default class PageAppbarStateBuilder extends AbstractStateBuilder {
  private _items: TStateLink[];

  constructor(private _state: TStateAppbar = {}) {
    super();
    this._items = [];
  }

  with_Id(_id: string): this {
    this._state._id = _id;
    return this;
  }
  with_Key(_key: string): this {
    this._state._key = _key;
    return this;
  }
  /**
   * Add a new link to the app bar.
   * @param item 
   * @returns this.
   */
  add(item: LinkStateBuilder): this {
    this._items?.push(item.build());
    return this;
  }
  /**
   * Set the input field icon button.
   * @param iconButton 
   * @returns this.
   */
  withSearchFieldIconButton(iconButton: LinkStateBuilder): this {
    this._state.searchFieldIconButton = iconButton.build();
    return this;
  }
  /**
   * Set the id of the mobile menu.
   * @param mobileMenuId 
   * @returns this.
   */
  withMobileMenuId(mobileMenuId: string): this {
    this._state.mobileMenuId = mobileMenuId;
    return this;
  }
  /**
   * Set app bar component props
   * @param props 
   * @returns this.
   */
  withProps(props: Record<string, any>): this {
    this._state.props = props;
    return this;
  }
  /**
   * Set the menu icon component props.
   * @param props 
   * @returns this.
   */
  withMenuIconProps(props: Record<string, any>) {
    this._state.menuIconProps = props;
    return this;
  }
  /**
   * Set the app bar typography.
   * @param typography 
   * @returns this.
   */
  withTypography(typography: TTypography): this {
    this._state.typography = typography;
    return this;
  }
  /**
   * Set the text logo component props.
   * @param props 
   * @returns this.
   */
  withTextLogoProps(props: TTextLogoProps): this {
    this._state.textLogoProps = props;
    return this;
  }
  /**
   * Set the input field component props.
   * @param props 
   * @returns this.
   */
  withSearchFieldProps(props: TSearchFieldProps): this {
    this._state.searchFieldProps = props;
    return this;
  }
  /**
   * Set to hide the input field icon.
   * @param hideSearchFieldIcon 
   * @returns this.
   */
  withHideSearchFieldIcon(hideSearchFieldIcon: boolean): this {
    this._state.hideSearchFieldIcon = hideSearchFieldIcon;
    return this;
  }
  /**
   * Set the input field icon.
   * @param instance 
   * @returns this.
   */
  withSearchFieldIcon(instance: FormItemCustomStateBuilder): this {
    this._state.searchFieldIcon = instance.build();
    return this;
  }
  /**
   * Set the input base component props.
   * @param props 
   * @returns this.
   */
  withInputBaseProps(props: TInputBaseProps): this {
    this._state.inputBaseProps = props;
    return this;
  }
  /**
   * Set the input field icon button component props.
   * @param props 
   * @returns this.
   */
  withSearchFieldIconButtonProps(props: TSearchFieldIconButtonProps) {
    this._state.searchFieldIconButtonProps = props;
    return this;
  }
  /** Get the state. @returns state. */
  build() {
    return this._state;
  }
}