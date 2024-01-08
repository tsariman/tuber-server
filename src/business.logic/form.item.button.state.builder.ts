import { TStateFormItem } from 'src/common.types';
import FormItemBaseStateBuilder from './form.item.base.state.builder';

export default class FormItemButtonStateBuilder extends FormItemBaseStateBuilder {
  constructor(protected readonly _state: TStateFormItem = {}) {
    super(_state);
    this._state.type = 'state_button';
  }
  /** **DO NOT USE.** Method not implemented. @returns this. */
  add() { return this.die('Method not implemented.', this); }
  /** **DO NOT USE.** Method not implemented. @returns this. */
  with_Id(): this { return this.die('Method not implemented.', this); }
  /** **DO NOT USE.** Method not implemented. @returns this. */
  with_Key(_key: string): this {
    return this.die('Method not implemented.', this);
  }
  /** **DO NOT USE.** Method not implemented. @returns this. */
  withType() { return this.die('Method not implemented.', this); }
  /**
   * Set an href for the button.
   * @param href 
   * @returns this.
   */
  withPropsHref(href: string): this {
    this._state.props = this._state.props ?? {};
    this._state.props.href = href;
    return this;
  }
  /**
   * Not possible to set event callback from server.
   * @returns this.
   */
  hasCallback(): this {
    return this.die('hasCallback() not implemented yet.', this);
  }
  /**
   * Set an icon for the button.
   * @param icon 
   * @returns this.
   */
  hasIcon(icon: string): this {
    this._state.has = this._state.has ?? {};
    this._state.has.icon = icon;
    return this;
  }
  /**
   * Set a font-awesome icon for the button.
   * @param faIcon 
   * @returns this.
   */
  hasFaIcon(faIcon: string): this {
    this._state.has = this._state.has ?? {};
    this._state.has.faIcon = faIcon;
    return this;
  }
  /**
   * Set props for button component.
   * @param props 
   * @returns this.
   */
  withProps(props: Record<string, any>): this {
    this._state.props = props;
    return this;
  }
}