import AbstractStateBuilder from '../../business.logic/builder/abstract.state.builder';
import {
  TJsonapiStateResponse,
  TStateAppbar,
  TStateLink
} from '../../shared';
import LinkStateBuilder from './link.state.builder';
import FormItemCustomStateBuilder from './form.item.custom.state.builder';
import { AppBarProps, IconButtonProps } from '@mui/material';

type TTypography = TStateAppbar['typography'];
type TTextLogoProps = TStateAppbar['textLogoProps'];
type TSearchContainerProps = TStateAppbar['searchContainerProps'];
type TInputBaseProps = { id?: string } & TStateAppbar['inputBaseProps'];
type TSearchFieldIconButtonProps = TStateAppbar['searchFieldIconButtonProps'];

export default class PageAppbarStateBuilder extends AbstractStateBuilder {
  private _items: TStateLink[];
  private _response?: TJsonapiStateResponse;
  private _pageKey?: string;

  constructor(private _state: TStateAppbar = {}) {
    super();
    this._items = [];
  }

  /** Calling this method is required if performing a state response. */
  withPageKey(pageKey: string): this {
    this._pageKey = pageKey;
    return this;
  }

  configure(conf: { pageKey?: string }): this {
    this._pageKey = conf.pageKey;
    return this;
  }

  /**
   * Converts state build to a stand alone state that can be returned as a HTTP
   * response.  
   * [ **warning** ] Instance must be configured with `pageKey` before calling.
   */
  withBootstrapState(): this {
    if (!this._pageKey) {
      throw new Error('Set the parent page by calling `withPageKey()` first');
    }
    this._response = {
      state: {
        pages: { [this._pageKey]: { appbar: this._state }},
        pagesLight: { [this._pageKey]: { appbar: this._state }},
        pagesDark: { [this._pageKey]: { appbar: this._state }},
      }
    };
    return this;
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
  withProps(props: AppBarProps): this {
    this._state.props = props;
    return this;
  }
  /**
   * Set the menu icon component props.
   * @param props 
   * @returns this.
   */
  withMenuIconProps(props: IconButtonProps): this {
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
  withSearchContainerProps(props: TSearchContainerProps): this {
    this._state.searchContainerProps = props;
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
  withSearchFieldIconButtonProps(props: TSearchFieldIconButtonProps): this {
    this._state.searchFieldIconButtonProps = props;
    return this;
  }
  /** Get the state. @returns state. */
  build(): TStateAppbar {
    return this._state;
  }
  buildResponse(): TJsonapiStateResponse {
    return this._response || this.responseNotDefined();
  }
}