import AbstractStateBuilder from './abstract.state.builder';
import { TJsonapiStateResponse, TStateLink, TStatePageDrawer } from '../../shared';
import LinkStateBuilder from './link.state.builder';
import { DrawerProps } from '@mui/material';

type TAnchor = TStatePageDrawer['anchor'];
type T_Type = TStatePageDrawer['_type'];
type TWidth = TStatePageDrawer['width'];

export default class DrawerStateBuilder extends AbstractStateBuilder {
  private _pageKey?: string;
  private _response?: TJsonapiStateResponse;
  private _items: TStateLink[];
  constructor(private _state: TStatePageDrawer = {}) {
    super();
    this._items = [];
  }
  buildResponse(): TJsonapiStateResponse {
    return this._response || this.response_not_defined();
  }
  configure(conf: { pageKey?: string }): this {
    this._pageKey = conf.pageKey;
    return this;
  }
  withBootstrapState(): this {
    if (!this._pageKey) {
      throw new Error('Set the parent page by calling `withPageKey()` first');
    }
    this._response = {
      state: {
        drawer: this._state,
        pages: {[this._pageKey]: { drawer: this._state }},
        pagesDark: {[this._pageKey]: { drawer: this._state }},
        pagesLight: {[this._pageKey]: { drawer: this._state }},
      }
    };
    return this;
  }
  /** Get the state. @returns state. */
  build(): TStatePageDrawer {
    if (this._items.length > 0) {
      this._state.items = this._items;
    }
    return this._state;
  }
  /**
   * Insert a new link into the drawer.
   * @param instance 
   * @returns this.
   */
  add(instance: LinkStateBuilder): this {
    this._items?.push(instance.build());
    return this;
  }
  withId(_id: string) {
    this._state._id = _id;
    return this;
  }
  withKey(_key: string) {
    this._state._key = _key;
    return this;
  }
  /**
   * Set the drawer type.
   * @param _type 
   * @returns this.
   */
  with_Type(_type: T_Type): this {
    this._state._type = _type;
    return this;
  }
  /** Set the drawer to be open. @returns this. */
  isOpen() {
    this._state.open = true;
    return this;
  }
  /** Set the drawer to be closed. @returns this. */
  isClosed() {
    this._state.open = false;
    return this;
  }
  /**
   * Set the width of the drawer.
   * @param width 
   * @returns this.
   */
  withWidth(width: TWidth): this {
    this._state.width = width;
    return this;
  }
  /**
   * Set the drawer component props.
   * @param props 
   * @returns this.
   */
  withProps(props: DrawerProps): this {
    this._state.props = props;
    return this;
  }
  /**
   * Set the drawer links.
   * @param items 
   * @returns this.
   */
  withItems(items: TStateLink[]): this {
    this._state.items = items;
    return this;
  }
  /**
   * Set the drawer anchor.
   * @param anchor 
   * @returns this.
   */
  withAnchor(anchor: TAnchor): this {
    this._state.anchor = anchor;
    return this;
  }
}
