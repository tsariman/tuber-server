import { TStateFormItemCustom, TStateLink } from 'src/common.types';
import AbstractStateBuilder from './abstract.state.builder';

type TColor = TStateFormItemCustom['color'];
type TType = TStateLink['type'];
type TProps = TStateLink['props'];
type TOnclickHandle = TStateFormItemCustom['onclickHandle'];
type TIcon = TStateFormItemCustom['icon'];
type TFaIcon = TStateFormItemCustom['faIcon'];
type TIconProps = TStateFormItemCustom['iconProps'];

export default class LinkStateBuilder extends AbstractStateBuilder {

  constructor(private _linkState: TStateLink = {}) {
    super();
  }

  with_Id(_id: string): this {
    this._linkState._id = _id;
    return this;
  }
  with_Key(_key: string): this {
    this._linkState._key = _key;
    return this;
  }
  withType(type: TType): this {
    this._linkState.type = type;
    return this;
  }
  withProps(props: TProps): this {
    this._linkState.props = props;
    return this;
  }
  withColor(color: TColor): this {
    this._linkState.has = this._linkState.has ?? {};
    this._linkState.has.color = color;
    return this;
  }
  withHandleOnClick(handleOnClick: TOnclickHandle): this {
    this._linkState.has = this._linkState.has ?? {};
    this._linkState.has.onclickHandle = handleOnClick;
    return this;
  }
  withText(text: string): this {
    this._linkState.has = this._linkState.has ?? {};
    this._linkState.has.text = text;
    return this;
  }
  withLabel(label: string): this {
    this._linkState.has = this._linkState.has ?? {};
    this._linkState.has.label = label;
    return this;
  }
  withRoute(route: string): this {
    this._linkState.has = this._linkState.has ?? {};
    this._linkState.has.route = route;
    return this;
  }
  withIcon(icon: TIcon): this {
    this._linkState.has = this._linkState.has ?? {};
    this._linkState.has.icon = icon;
    return this;
  }
  withFaIcon(faIcon: TFaIcon): this {
    this._linkState.has = this._linkState.has ?? {};
    this._linkState.has.faIcon = faIcon;
    return this;
  }
  withSvgIcon(svgIcon: string): this {
    this._linkState.has = this._linkState.has ?? {};
    this._linkState.has.svgIcon = svgIcon;
    return this;
  }
  withIconProps(iconProps: TIconProps): this {
    this._linkState.has = this._linkState.has ?? {};
    this._linkState.has.iconProps = iconProps;
    return this;
  }
  build() {
    return this._linkState;
  }
  /** **DO NOT USE**. This method is not implemented. */
  add() {
    return this.die('Method not implemented.', this);
  }
}