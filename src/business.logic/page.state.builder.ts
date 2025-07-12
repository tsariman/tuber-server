import AbstractStateBuilder from './abstract.state.builder';
import { TStateBackground, TStateComponent, TStatePage } from '../common.types';
import PageAppbarStateBuilder from './appbar.state.builder';
import TypographyStateBuilder from './typography.state.builder';
import DrawerStateBuilder from './drawer.state.builder';

export type TStatePageType = '$form'
  | '$webapp'
  | '$html'
  | '$form_load'
  | '$html_load';

export default class PageStateBuilder extends AbstractStateBuilder {
  private _appbar?: PageAppbarStateBuilder;
  private _typography?: TypographyStateBuilder;
  private _state: TStatePage;

  constructor(state?: TStatePage) {
    super();
    this._state = state ?? {};
  }

  with_Id(id: string) {
    this._state._id = id;
    return this;
  }
  with_Key(key: string) {
    this._state._key = key;
    return this;
  }
  with_Type(type: TStatePage['_type']) {
    this._state._type = type;
    return this;
  }
  withTitle(title: string) {
    this._state.title = title;
    return this;
  }
  withForcedTitle(forcedTitle: string) {
    this._state.forcedTitle = forcedTitle;
    return this;
  }
  withAppbar(appbar: PageAppbarStateBuilder) {
    this._appbar = appbar;
    return this;
  }
  withAppbarCustom(appbarCustom: TStateComponent) {
    this._state.appbarCustom = appbarCustom;
    return this;
  }
  withBackground(background: TStateBackground) {
    this._state.background = background;
    return this;
  }
  withTypography(typography: TypographyStateBuilder) {
    this._typography = typography;
    return this;
  }
  withContent (type: TStatePageType,
    name: string,
    endpoint?: string
  ) {
    this._state.content = `${type}:${name}${endpoint ? `:${endpoint}` : ''}`;
    return this;
  }
  withDrawer(drawer: DrawerStateBuilder) {
    this._state.drawer = drawer.build();
    return this;
  }
  withLayout(layout: TStatePage['layout']) {
    this._state.layout = layout;
    return this;
  }
  withHideAppbar(bool: boolean) {
    this._state.hideAppbar = bool;
    return this;
  }
  withHideDrawer(bool: boolean) {
    this._state.hideDrawer = bool;
    return this;
  }
  withUseDefaultAppbar(bool: boolean) {
    this._state.useDefaultAppbar = bool;
    return this;
  }
  withUseDefaultDrawer(bool: boolean) {
    this._state.useDefaultDrawer = bool;
    return this;
  }
  withGenerateDefaultDrawer(bool: boolean) {
    this._state.generateDefaultDrawer = bool;
    return this;
  }
  withUseDefaultBackground(bool: boolean) {
    this._state.useDefaultBackground = bool;
    return this;
  }
  withUseDefaultTypography(bool: boolean) {
    this._state.useDefaultTypography = bool;
    return this;
  }
  withInherited(_key: string) {
    this._state.inherited = _key;
    return this;
  }
  withAppbarInherited(_key: string) {
    this._state.appbarInherited = _key;
    return this;
  }
  withAppbarCustomInherited(_key: string) {
    this._state.appbarCustomInherited = _key;
    return this;
  }
  withDrawerInherited(_key: string) {
    this._state.drawerInherited = _key;
    return this;
  }
  withInheritContent (_key: string) {
    this._state.contentInherited = _key;
    return this;
  }
  withInheritBackground (_key: string) {
    this._state.backgroundInherited = _key;
    return this;
  }
  withData(data: any) {
    this._state.data = data;
    return this;
  }
  withMeta(meta: any) {
    this._state.meta = meta;
    return this;
  }
  withLinks(links: any) {
    this._state.links = links;
    return this;
  }
  build() {
    this._state.appbar = this._appbar?.build();
    this._state.typography = this._typography?.build();
    return this._state;
  }
  /** **DO NOT USE**. This method is not implemented. */
  add() {
    return this.die('PageStateBuilder.add() not implemented.',
      this
    );
  }
}